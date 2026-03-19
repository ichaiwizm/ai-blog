#!/usr/bin/env python3
"""Initialize PocketBase for ai-blog: create collection + migrate MDX articles."""

import requests
import json
import re
import time
import sys
from pathlib import Path

PB_URL = "http://127.0.0.1:8095"
PB_EMAIL = "admin@vpsdashboard.space"
PB_PASSWORD = "Admin123456"
POSTS_DIR = Path(__file__).parent.parent / "content" / "posts"


def wait_for_pocketbase(timeout=60):
    print("Waiting for PocketBase to be ready...")
    start = time.time()
    while time.time() - start < timeout:
        try:
            r = requests.get(f"{PB_URL}/api/health", timeout=5)
            if r.status_code == 200:
                print("✓ PocketBase is ready")
                return True
        except Exception:
            pass
        time.sleep(2)
    print("✗ PocketBase did not start in time")
    return False


def auth_with_email():
    """Authenticate with email/password for admin access."""
    r = requests.post(
        f"{PB_URL}/api/collections/users/auth-with-password",
        json={
            "identity": PB_EMAIL,
            "password": PB_PASSWORD,
        },
        timeout=10,
    )
    if r.status_code == 200:
        token = r.json().get("token")
        print(f"✓ Authenticated: {PB_EMAIL}")
        return token
    else:
        raise Exception(f"Auth failed: {r.status_code} {r.text[:200]}")


def collection_exists(token, name):
    r = requests.get(
        f"{PB_URL}/api/collections/{name}",
        headers={"Authorization": token},
        timeout=10,
    )
    return r.status_code == 200


def create_collection(token):
    schema = {
        "name": "articles",
        "type": "base",
        "schema": [
            {"name": "slug", "type": "text", "required": True, "options": {"max": 200}},
            {"name": "title", "type": "text", "required": True, "options": {"max": 500}},
            {"name": "description", "type": "text", "required": False, "options": {"max": 1000}},
            {"name": "content", "type": "text", "required": False, "options": {"max": 100000}},
            {"name": "date", "type": "text", "required": True, "options": {"max": 50}},
            {"name": "tags", "type": "json", "required": False},
            {"name": "category", "type": "select", "required": False, "options": {
                "values": ["tutoriels", "actualites", "opinions", "comparatifs"],
                "maxSelect": 1,
            }},
            {"name": "published", "type": "bool", "required": False},
            {"name": "image", "type": "url", "required": False, "options": {"exceptDomains": []}},
            {"name": "source", "type": "text", "required": False, "options": {"max": 50}},
        ],
        "listRule": "published = true",
        "viewRule": "published = true",
        "createRule": None,
        "updateRule": None,
        "deleteRule": None,
    }
    r = requests.post(
        f"{PB_URL}/api/collections",
        headers={"Authorization": token, "Content-Type": "application/json"},
        json=schema,
        timeout=15,
    )
    if r.status_code in (200, 201):
        print("✓ Collection 'articles' created")
    elif r.status_code == 400 and "already exists" in r.text.lower():
        print("✓ Collection 'articles' already exists")
    else:
        print(f"  Warning: collection creation returned {r.status_code}: {r.text[:200]}")


def parse_frontmatter(text):
    """Parse YAML frontmatter from MDX content."""
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', text, re.DOTALL)
    if not match:
        return {}, text

    fm_text = match.group(1)
    content = match.group(2).strip()
    fm = {}

    for line in fm_text.split('\n'):
        line = line.strip()
        if ':' not in line:
            continue
        key, _, value = line.partition(':')
        key = key.strip()
        value = value.strip().strip('"').strip("'")

        if key == 'tags':
            try:
                fm[key] = json.loads(value) if value.startswith('[') else []
            except Exception:
                fm[key] = []
        elif key == 'published':
            fm[key] = value.lower() not in ('false', '0', 'no')
        else:
            fm[key] = value

    return fm, content


def migrate_mdx_to_pb(token):
    """Migrate MDX files to PocketBase."""
    if not POSTS_DIR.exists():
        print(f"  Posts directory not found: {POSTS_DIR}")
        return

    mdx_files = list(POSTS_DIR.glob("*.mdx"))
    print(f"\nMigrating {len(mdx_files)} MDX articles to PocketBase...")

    for mdx_path in mdx_files:
        slug = mdx_path.stem
        text = mdx_path.read_text(encoding="utf-8")
        fm, content = parse_frontmatter(text)

        check = requests.get(
            f"{PB_URL}/api/collections/articles/records",
            params={"filter": f'(slug="{slug}")', "perPage": 1},
            headers={"Authorization": token},
            timeout=10,
        )
        if check.status_code == 200 and check.json().get("totalItems", 0) > 0:
            print(f"  → Skipping {slug} (already exists)")
            continue

        record = {
            "slug": slug,
            "title": fm.get("title", slug),
            "description": fm.get("description", ""),
            "content": content,
            "date": fm.get("date", "2025-01-01"),
            "tags": json.dumps(fm.get("tags", [])),
            "category": fm.get("category", ""),
            "published": fm.get("published", True),
            "image": fm.get("image", ""),
            "source": "mdx",
        }

        r = requests.post(
            f"{PB_URL}/api/collections/articles/records",
            headers={"Authorization": token, "Content-Type": "application/json"},
            json=record,
            timeout=15,
        )
        if r.status_code in (200, 201):
            print(f"  ✓ Migrated: {slug}")
        else:
            print(f"  ✗ Failed to migrate {slug}: {r.status_code} {r.text[:100]}")


def main():
    if not wait_for_pocketbase():
        sys.exit(1)

    try:
        token = auth_with_email()

        if not collection_exists(token, "articles"):
            create_collection(token)
        else:
            print("✓ Collection 'articles' already exists")

        migrate_mdx_to_pb(token)
        print("\n✅ PocketBase initialization complete!")
    except Exception as e:
        print(f"\n✗ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
