#!/usr/bin/env python3
"""
Autonomous article generator for ai-blog.wizycode.fr
- Fetches recent AI/tech news via direct HTTP
- Generates MDX article via AI Gateway (GLM-4.7 / fallback models)
- Generates image via Kieai
- Saves to PocketBase
"""

import argparse
import json
import re
import subprocess
import sys
import time
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

import requests

# ─── CONFIG ────────────────────────────────────────────────────────────────

def _get_pb_url():
    try:
        ip = subprocess.check_output(
            ["docker", "inspect", "-f",
             "{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}",
             "pocketbase-ai-blog"],
            text=True, timeout=5
        ).strip()
        if ip:
            return f"http://{ip}:8090"
    except Exception:
        pass
    return "http://127.0.0.1:8095"

def _get_gw_url():
    try:
        ip = subprocess.check_output(
            ["docker", "inspect", "-f",
             "{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}",
             "ai-gateway"],
            text=True, timeout=5
        ).strip()
        if ip:
            return f"http://{ip}:3000"
    except Exception:
        pass
    return "http://ai-gateway:3000"

PB_URL = _get_pb_url()
PB_EMAIL = "admin@vpsdashboard.space"
PB_PASSWORD = "Admin123456"

AI_GW_URL = _get_gw_url()
AI_GW_KEY = "ee4857ac2fd631d8489a7be9bde42e800804a268905af21513a6ae4985ef7072"
AI_MODEL = "glm-4.7"

KIEAI_KEY = "727746ff383b3e3775967207d2cda33b"

SEARCH_TOPICS = [
    "Claude Anthropic nouvelles fonctionnalités IA 2026",
    "GPT OpenAI actualité intelligence artificielle 2026",
    "développement web Next.js React 2026",
    "outils IA développeurs productivité 2026",
    "Gemini Google AI nouvelles fonctions 2026",
    "modèles de langage LLM comparaison 2026",
    "IA générative image vidéo actualité 2026",
    "programmation assistée IA GitHub Copilot 2026",
    "startup IA France actualité 2026",
    "cybersécurité IA menaces 2026",
]

UNSPLASH_POOL = [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80",
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80",
    "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&q=80",
    "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1200&q=80",
    "https://images.unsplash.com/photo-1676299081847-824916de030a?w=1200&q=80",
    "https://images.unsplash.com/photo-1687360440027-4f13aced3c28?w=1200&q=80",
    "https://images.unsplash.com/photo-1701952099993-696c50be17e5?w=1200&q=80",
    "https://images.unsplash.com/photo-1666597107756-ef489e9f1f09?w=1200&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80",
]


# ─── WEB SEARCH (plusieurs sources) ─────────────────────────────────────────

def search_bing(query: str) -> list[dict]:
    """Try Bing search (no key needed for basic results)."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0',
            'Accept': 'text/html',
            'Accept-Language': 'fr-FR,fr;q=0.9',
        }
        q = urllib.parse.quote(query)
        r = requests.get(f"https://www.bing.com/search?q={q}&cc=fr&setlang=fr", headers=headers, timeout=6)
        if r.status_code != 200:
            return []
        
        # Extract snippets from Bing HTML
        snippets = re.findall(r'<p class="b_algoSlug[^"]*"[^>]*>(.*?)</p>', r.text, re.DOTALL)
        titles = re.findall(r'<h2><a[^>]*>(.*?)</a></h2>', r.text, re.DOTALL)
        
        results = []
        for i, (t, s) in enumerate(zip(titles[:5], snippets[:5])):
            title = re.sub(r'<[^>]+>', '', t).strip()
            desc = re.sub(r'<[^>]+>', '', s).strip()
            if title and desc:
                results.append({"title": title, "description": desc[:300]})
        return results
    except Exception as e:
        print(f"  Bing search error: {e}")
        return []


def search_ddg(query: str) -> list[dict]:
    """DuckDuckGo instant answers."""
    try:
        q = urllib.parse.quote(query)
        r = requests.get(
            f"https://api.duckduckgo.com/?q={q}&format=json&no_redirect=1&no_html=1",
            timeout=5,
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        if r.status_code != 200:
            return []
        d = r.json()
        results = []
        
        # RelatedTopics
        for topic in d.get("RelatedTopics", [])[:5]:
            if isinstance(topic, dict) and topic.get("Text"):
                results.append({
                    "title": topic.get("Text", "")[:80],
                    "description": topic.get("Text", "")[:300],
                })
        
        if d.get("AbstractText"):
            results.insert(0, {"title": d.get("Heading", query), "description": d.get("AbstractText", "")[:400]})
        
        return results[:5]
    except Exception as e:
        return []


def get_web_context(topic: str) -> str:
    """Get web context for the topic."""
    print("  Searching Bing...")
    results = search_bing(topic)
    if not results:
        print("  Trying DuckDuckGo...")
        results = search_ddg(topic)
    
    if results:
        ctx = f"Contexte web sur '{topic}':\n"
        for r in results[:4]:
            ctx += f"- {r['title']}: {r['description']}\n"
        return ctx
    return f"Pas de contexte web disponible pour '{topic}'."


# ─── AI GENERATION ──────────────────────────────────────────────────────────

def generate_with_gateway(prompt: str, model: str = AI_MODEL) -> str | None:
    """Generate content via AI Gateway (OpenAI-compatible endpoint)."""
    try:
        r = requests.post(
            f"{AI_GW_URL}/v1/chat/completions",
            headers={
                "x-api-key": AI_GW_KEY,
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "stream": False,
                "max_tokens": 4000,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=120,
        )
        if r.status_code == 200:
            return r.json()["choices"][0]["message"]["content"].strip()
        print(f"  Gateway error {r.status_code}: {r.text[:200]}")
        return None
    except Exception as e:
        print(f"  Gateway error: {e}")
        return None


def generate_article(topic: str, web_context: str) -> str | None:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    prompt = f"""Tu es un rédacteur expert pour le blog wizycode.fr, spécialisé en intelligence artificielle et développement web.

Écris un article de blog complet en FRANÇAIS sur : **{topic}**

Contexte actuel (utilise ces informations pour rendre l'article pertinent et récent) :
{web_context}

FORMAT OBLIGATOIRE — Retourne UNIQUEMENT le MDX brut, commençant par ---, sans texte avant ni après :

---
title: "Titre accrocheur et SEO de l'article"
description: "Description de 120-150 caractères optimisée SEO"
date: "{today}"
tags: ["Tag1", "Tag2", "Tag3", "Tag4"]
category: "actualites"
published: true
image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80"
---

## Introduction (2-3 paragraphes accrocheurs)

Explication du sujet, pourquoi c'est important maintenant.

## Section 1 (titre descriptif)

Contenu détaillé...

## Section 2 (titre descriptif)

Contenu détaillé...

## Section 3 (titre descriptif)

Contenu détaillé...

## Conclusion

Résumé actionnable et perspective.

CONTRAINTES :
- 900 à 1300 mots de contenu (hors frontmatter)
- Style : expert mais accessible, direct, comme un développeur senior passionné
- Utilise **gras** pour les points clés
- Évite le jargon inutile, préfère des exemples concrets
- Termine par une conclusion qui donne envie d'agir
- NE PAS mettre de balises ```mdx autour, retourner UNIQUEMENT le MDX brut"""

    text = generate_with_gateway(prompt)
    if not text:
        print("  Retrying with backup approach...")
        # Simplify prompt for retry
        simple_prompt = f"Écris un article de blog MDX complet en français sur : {topic}. Date: {today}. Commence directement par --- (frontmatter YAML) sans aucun texte avant. 900 mots minimum."
        text = generate_with_gateway(simple_prompt)
    return text


# ─── IMAGE GENERATION ───────────────────────────────────────────────────────

def get_image(topic: str, index: int = 0) -> str:
    """Try Kieai image generation, fallback to Unsplash."""
    try:
        r = requests.post(
            "https://api.kie.ai/api/v1/flux/generate",
            headers={"Authorization": f"Bearer {KIEAI_KEY}", "Content-Type": "application/json"},
            json={
                "prompt": f"Professional tech blog illustration: {topic}. Modern, minimalist, no text, high quality.",
                "model": "flux-schnell",
            },
            timeout=45,
        )
        if r.status_code == 200:
            data = r.json()
            url = data.get("url") or data.get("image_url") or ""
            if url and url.startswith("http"):
                print(f"  ✓ Image from Kieai")
                return url
    except Exception:
        pass
    
    url = UNSPLASH_POOL[index % len(UNSPLASH_POOL)]
    print(f"  → Unsplash fallback")
    return url


# ─── MDX PARSING ────────────────────────────────────────────────────────────

def parse_mdx(text: str) -> tuple[dict, str]:
    text = text.strip()
    # Remove ```mdx / ``` wrappers if any
    text = re.sub(r'^```(?:mdx|markdown)?\s*\n?', '', text)
    text = re.sub(r'\n?```\s*$', '', text)
    text = text.strip()

    m = re.match(r'^---\s*\n(.*?)\n---\s*\n?(.*)', text, re.DOTALL)
    if not m:
        return {}, text

    fm_text, content = m.group(1), m.group(2).strip()
    fm: dict = {}

    for line in fm_text.split('\n'):
        if ':' not in line:
            continue
        k, _, v = line.partition(':')
        k = k.strip()
        v = v.strip().strip('"').strip("'")
        if k == 'tags':
            try:
                fm[k] = json.loads(v) if v.startswith('[') else [t.strip().strip('"') for t in v.strip('[]').split(',') if t.strip()]
            except Exception:
                fm[k] = []
        elif k == 'published':
            fm[k] = v.lower() not in ('false', '0', 'no')
        else:
            fm[k] = v

    return fm, content


def slugify(title: str) -> str:
    s = title.lower()
    for fr, lat in [('à','a'),('â','a'),('é','e'),('è','e'),('ê','e'),('ë','e'),
                    ('î','i'),('ï','i'),('ô','o'),('ù','u'),('û','u'),('ü','u'),('ç','c')]:
        s = s.replace(fr, lat)
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'[\s]+', '-', s.strip())
    s = re.sub(r'-+', '-', s)
    return s[:80].strip('-')


# ─── POCKETBASE ─────────────────────────────────────────────────────────────

def pb_auth() -> str:
    r = requests.post(
        f"{PB_URL}/api/collections/_superusers/auth-with-password",
        json={"identity": PB_EMAIL, "password": PB_PASSWORD},
        timeout=10,
    )
    if r.status_code != 200:
        raise Exception(f"PocketBase auth failed: {r.status_code} {r.text[:100]}")
    return r.json()["token"]


def pb_save(token: str, record: dict) -> bool:
    slug = record["slug"]
    hdrs = {"Authorization": token, "Content-Type": "application/json"}

    # Check duplicate
    chk = requests.get(
        f"{PB_URL}/api/collections/articles/records",
        params={"filter": f'(slug="{slug}")', "perPage": 1},
        headers=hdrs, timeout=10,
    )
    if chk.status_code == 200 and chk.json().get("totalItems", 0) > 0:
        rec_id = chk.json()["items"][0]["id"]
        r = requests.patch(f"{PB_URL}/api/collections/articles/records/{rec_id}", headers=hdrs, json=record, timeout=15)
    else:
        r = requests.post(f"{PB_URL}/api/collections/articles/records", headers=hdrs, json=record, timeout=15)

    return r.status_code in (200, 201)


# ─── MAIN ───────────────────────────────────────────────────────────────────

def generate_one(topic: str, dry_run: bool, index: int = 0) -> bool:
    print(f"\n{'='*60}")
    print(f"Topic: {topic}")
    print(f"{'='*60}")

    # 1. Web context
    print("1. Getting web context...")
    ctx = get_web_context(topic)
    print(f"   Context: {len(ctx)} chars")

    # 2. Generate article
    print("2. Generating article...")
    mdx = generate_article(topic, ctx)
    if not mdx:
        print("   ✗ Generation failed")
        return False

    # 3. Parse
    fm, content = parse_mdx(mdx)
    if not fm.get("title"):
        print("   ✗ Could not parse frontmatter")
        print(f"   Preview: {mdx[:300]}")
        return False

    title = fm["title"]
    slug = slugify(title)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    print(f"   ✓ '{title}'")
    print(f"   ✓ slug: {slug} | words: {len(content.split())} | tags: {fm.get('tags', [])}")

    # 4. Image
    print("3. Getting image...")
    image = fm.get("image", "")
    if not image or "XXXXXXXXXX" in image or not image.startswith("http"):
        image = get_image(topic, index)

    # 5. Record
    record = {
        "slug": slug,
        "title": title,
        "description": fm.get("description", ""),
        "content": content,
        "date": fm.get("date", today),
        "tags": json.dumps(fm.get("tags", [])),
        "category": fm.get("category", "actualites"),
        "published": True,
        "image": image,
        "source": "generated",
    }

    if dry_run:
        print(f"\n[DRY RUN] Would save: {slug}")
        print(f"  Description: {record['description'][:100]}")
        print(f"  Content preview: {content[:200]}...")
        return True

    # 6. Save
    print("4. Saving to PocketBase...")
    try:
        token = pb_auth()
        if pb_save(token, record):
            print(f"   ✓ Saved: https://ai-blog.wizycode.fr/blog/{slug}")
            return True
        print("   ✗ Save failed")
    except Exception as e:
        print(f"   ✗ PocketBase error: {e}")
    return False


def main():
    parser = argparse.ArgumentParser(description="Generate blog articles for ai-blog.wizycode.fr")
    parser.add_argument("--topic", type=str, help="Specific topic to write about")
    parser.add_argument("--count", type=int, default=1)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    print(f"PocketBase: {PB_URL}")
    print(f"AI Gateway: {AI_GW_URL}")

    import random
    if args.topic:
        topics = [args.topic] * args.count
    else:
        topics = random.sample(SEARCH_TOPICS, min(args.count, len(SEARCH_TOPICS)))
        if len(topics) < args.count:
            topics += random.choices(SEARCH_TOPICS, k=args.count - len(topics))

    ok = 0
    for i, topic in enumerate(topics):
        if generate_one(topic, args.dry_run, i):
            ok += 1
        if i < len(topics) - 1:
            time.sleep(3)

    print(f"\n{'='*60}")
    print(f"Result: {ok}/{len(topics)} articles {'(dry-run)' if args.dry_run else 'published'}")
    if ok and not args.dry_run:
        print(f"→ https://ai-blog.wizycode.fr/blog")


if __name__ == "__main__":
    main()
