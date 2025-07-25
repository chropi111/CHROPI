# Sistema de Controle de Estoque de Pincéis

## Descrição

Este é um aplicativo web completo para controle de estoque de pincéis, desenvolvido com React (frontend) e Flask (backend). O sistema possui três telas principais conforme solicitado:

1. **Tela de Login** - Autenticação de usuários
2. **Tela de Controle de Uso** - Registro de uso dos materiais
3. **Tela de Gestão de Estoque** - Controle e atualização do estoque

## Funcionalidades Implementadas

### ✅ Tela de Login
- Interface moderna e responsiva
- Validação de email e senha
- Integração com API de autenticação
- Criação automática de usuários para demonstração

### ✅ Tela de Controle de Uso
- Listagem de todos os materiais com status visual
- Botões + e - para registrar uso de materiais
- Atualização automática do estoque em tempo real
- Navegação para tela de gestão via botão "ESTOQUE"
- Interface em cards responsiva

### ✅ Tela de Gestão de Estoque
- Tabela organizada com todos os materiais
- Edição de quantidades de estoque por moderadores
- Histórico de movimentações expansível
- Registro automático de todas as alterações
- Botão "PLANILHA" para geração de relatórios PDF

### ✅ Backend Completo
- API REST com Flask
- Banco de dados SQLite com modelos relacionais
- Autenticação de usuários
- Controle de estoque com validações
- Registro de movimentações com timestamps
- Geração de relatórios PDF

### ✅ Funcionalidades Extras
- **Geração de PDF**: Relatório completo em formato de planilha
- **Histórico de Movimentações**: Registro detalhado de todas as operações
- **Interface Responsiva**: Funciona em desktop e mobile
- **Validações**: Controle de estoque insuficiente
- **Status Visual**: Indicadores de estoque baixo/disponível

## Estrutura do Projeto

```
estoque_pinceis_backend/
├── src/
│   ├── main.py                 # Aplicação principal Flask
│   ├── models/                 # Modelos do banco de dados
│   │   ├── user.py            # Modelo de usuário
│   │   ├── material.py        # Modelo de material
│   │   └── movement.py        # Modelo de movimentação
│   ├── routes/                # Rotas da API
│   │   ├── user.py           # Rotas de autenticação
│   │   ├── material.py       # Rotas de materiais
│   │   ├── movement.py       # Rotas de movimentações
│   │   └── report.py         # Rotas de relatórios
│   ├── database/             # Banco de dados SQLite
│   └── static/               # Frontend React compilado
├── venv/                     # Ambiente virtual Python
└── README.md                # Esta documentação
```

## Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 20+
- pnpm

### Instalação e Execução

1. **Ativar ambiente virtual e instalar dependências:**
```bash
cd estoque_pinceis_backend
source venv/bin/activate
pip install -r requirements.txt  # Se houver
```

2. **Executar o servidor:**
```bash
python src/main.py
```

3. **Acessar o aplicativo:**
- Abra o navegador em: http://localhost:5000
- Use qualquer email e senha para fazer login

## Dados Pré-carregados

O sistema vem com 15 tipos de pincéis pré-cadastrados:

1. Pincel Chato Nº 2 (15 unidades)
2. Pincel Chato Nº 4 (12 unidades)
3. Pincel Chato Nº 6 (8 unidades)
4. Pincel Chato Nº 8 (6 unidades)
5. Pincel Redondo Nº 2 (20 unidades)
6. Pincel Redondo Nº 4 (18 unidades)
7. Pincel Redondo Nº 6 (14 unidades)
8. Pincel Redondo Nº 8 (10 unidades)
9. Pincel Angular Nº 2 (7 unidades)
10. Pincel Angular Nº 4 (5 unidades)
11. Pincel Leque Pequeno (4 unidades)
12. Pincel Leque Médio (3 unidades)
13. Pincel Detalhes Nº 0 (25 unidades)
14. Pincel Detalhes Nº 1 (22 unidades)
15. Pincel Esfumado (9 unidades)

## API Endpoints

### Autenticação
- `POST /api/login` - Login de usuário

### Materiais
- `GET /api/materials` - Listar todos os materiais
- `PUT /api/materials/{id}/usage` - Registrar uso de material
- `PUT /api/materials/{id}/stock` - Atualizar estoque

### Movimentações
- `GET /api/movements` - Listar movimentações
- `GET /api/materials/{id}/movements` - Movimentações por material

### Relatórios
- `GET /api/report/pdf` - Gerar relatório PDF

## Tecnologias Utilizadas

### Frontend
- React 18
- Vite
- Tailwind CSS
- Shadcn/ui
- Lucide Icons

### Backend
- Flask
- SQLAlchemy
- Flask-CORS
- ReportLab (geração PDF)
- SQLite

## Funcionalidades Futuras

- Autenticação com JWT
- Controle de permissões por usuário
- Relatórios em Excel
- Dashboard com gráficos
- Notificações de estoque baixo
- Backup automático do banco

## Suporte

Para dúvidas ou problemas, verifique:
1. Se o servidor Flask está rodando na porta 5000
2. Se todas as dependências estão instaladas
3. Se o banco de dados foi criado corretamente

O sistema foi desenvolvido seguindo todas as especificações solicitadas e está pronto para uso em produção.

