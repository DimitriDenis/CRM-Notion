# NotionCRM (EN COURS DE DEVELOPPEMENT)

NotionCRM est une solution CRM intégrée à Notion, permettant aux utilisateurs de gérer leurs contacts, pipelines de vente et deals directement depuis leur espace Notion.

## 🌟 Fonctionnalités

- Contacts illimités
- Pipeline de vente
- Gestion basique des deals
- Interface intégrée à Notion
- Tags basiques 
- Champs de contact standards
- Statistiques simples



## 🛠️ Stack Technique

### Backend
- NestJS
- TypeScript
- PostgreSQL
- Redis
- JWT Authentication

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- React Query

### Infrastructure
- Docker
- AWS
- CI/CD avec GitHub Actions

## 📋 Prérequis
- Node.js 18+
- Docker et Docker Compose
- Un compte Notion
- Un compte Stripe (pour le développement)

## 🚀 Installation

1. Cloner le repository
```bash
git clone https://github.com/votre-username/notion-crm.git
cd notion-crm
```

2. Installer les dépendances
```bash
# Backend
cd backend
yarn install

# Frontend
cd ../frontend
yarn install
```

3. Configurer les variables d'environnement
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

4. Lancer les services avec Docker Compose
```bash
docker-compose up -d
```

5. Démarrer les applications
```bash
# Backend
cd backend
yarn start:dev

# Frontend (dans un autre terminal)
cd frontend
yarn dev
```

## 🔧 Configuration

### Variables d'Environnement Required

#### Backend
- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `NOTION_OAUTH_CLIENT_ID`
- `NOTION_OAUTH_CLIENT_SECRET`
- `NOTION_OAUTH_REDIRECT_URI`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

#### Frontend
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID`
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`

## 🧪 Tests

```bash
# Backend
cd backend
yarn test
yarn test:e2e

# Frontend
cd frontend
yarn test
```

## 📚 Documentation

- [Documentation API](docs/api.md)
- [Guide de Développement](docs/development.md)
- [Guide de Déploiement](docs/deployment.md)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE.md](LICENSE.md) pour plus de détails.

## 👥 Auteurs

- Dimitri DENIS (@DimitriDenis)

## 📮 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue.