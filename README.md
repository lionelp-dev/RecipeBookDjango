# Recipe Book — Django + Inertia

Socle minimal Django, Inertia.js, React et Vite. La page d’accueil reçoit le
message `Hello World` de la vue Django et l’affiche dans React.

## Prérequis

- Python 3.14+
- Node.js et pnpm

## Installation

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
pnpm install
python manage.py migrate
```

## Démarrage

Lancer Vite et Django ensemble :

```bash
pnpm dev
```

Ouvrir <http://127.0.0.1:8000/>. Pour vérifier le frontend sans le lancer,
utiliser `pnpm typecheck` et `pnpm build`.

Si le port 8000 est déjà occupé, lancer Django avec
`python manage.py runserver 8010` puis ouvrir <http://127.0.0.1:8010/>.
