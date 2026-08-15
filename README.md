# Seed a Bit: Sistema de Reservas de Salas

Este projeto foi desenvolvido como resolução do **Desafio Prático para Habilitação de Tech Lead 2026.2** da Seed a Bit.
O sistema permite o gerenciamento completo de reservas de salas, contemplando autenticação, controle de acesso (Admin vs User), listagem, criação e cancelamento de reservas com validação de conflito de horários.

## 🛠 Stacks Utilizadas (Padrão Seed a Bit)

- **Backend:** NestJS, TypeScript, Prisma ORM.
- **Frontend:** Next.js (App Router), React, Tailwind CSS (Design System Glassmorphism / UI Moderna).
- **Banco de Dados:** PostgreSQL.
- **Infraestrutura:** Docker e Docker Compose.

---

## 🚀 Como Executar o Projeto

O projeto foi inteiramente dockerizado para garantir uma execução simples e idêntica em qualquer ambiente.

### Pré-requisitos
- Ter o [Docker](https://www.docker.com/) instalado na sua máquina.
- Ter o [Docker Compose](https://docs.docker.com/compose/) instalado.
- Portas `3003`, `8085`, `5435` e `5050` livres.

### Passo a Passo

1. **Clone o repositório** e acesse a pasta raiz:
   ```bash
   git clone <url-do-repositorio>
   cd sistema-de-reservas
   ```

2. **Suba os contêineres** através do docker-compose:
   ```bash
   docker-compose up -d --build
   ```
   > Esse comando irá baixar a imagem do Postgres, inicializar o banco, aplicar as migrations automaticamente, popular o banco com um Admin padrão (seed) e, em seguida, subir a API NestJS e a Aplicação Next.js.

3. **Acesse as Aplicações:**
   - **Frontend:** [http://localhost:8085](http://localhost:8085)
   - **Backend (API Base):** `http://localhost:3003`
   - **Painel de Banco de Dados (pgAdmin):** [http://localhost:5050](http://localhost:5050)
     - *Login pgAdmin:* `admin@seedabit.com` / `admin`

---

## 🔒 Credenciais de Acesso (Seed)

O banco de dados já inicializa populado com usuários e salas de teste. Você pode testar os dois níveis de acesso na tela de login (`http://localhost:8085`):

**Acesso Administrador (Possui permissão para CRUD de Salas):**
- **E-mail:** `admin@seedabit.com.br`
- **Senha:** `123456`

**Acesso Usuário Comum:**
- **E-mail:** `joao@seedabit.com.br` (ou crie um novo pelo próprio endpoint de API)
- **Senha:** `123456`

---

## ✅ Funcionalidades Contempladas (Requisitos do Edital)

1. **Autenticação:** Login e emissão de JWT, com diferenciação de "Role" (USER / ADMIN).
2. **Listagem das salas:** Dashboard interativo em grid com informações de capacidade e descrição.
3. **Criação de reservas:** Modal rico (estilo calendário) com seleção de horários baseada em blocos e cálculo dinâmico para extensão de reuniões.
4. **Cancelamento de reservas:** O usuário consegue ver todo o histórico em "Minhas Reservas" e cancelar apenas os agendamentos ativos.
5. **Visualização da agenda:** Integração com o componente de calendário e a tela de histórico.
6. **Validação de conflitos:** Dupla validação (No Frontend, horários bloqueados ficam "riscados" e impedem cliques longos que esbarrem em outras reservas; no Backend, o banco garante a transação jogando erro `409 Conflict`).
7. **Painel Administrativo:** Tela protegida exclusiva para Administradores com CRUD visual completo (Criar, Editar, Excluir Salas).

---

## 🏗 Arquitetura e Decisões Técnicas

- **Clean Code e Validações:** Separação estrita de Controllers e Services no Backend; Uso de DTOs para validação de payload; Guardiões (Guards) para bloqueio de rotas com base no JWT (`@UseGuards(JwtAuthGuard)` e `@Roles(Role.ADMIN)`).
- **Tratamento de Erros:** O Backend não "crasha". Foi adotada uma política de tratamento global usando as classes nativas do NestJS (`ConflictException`, `NotFoundException`), devolvendo respostas HTTP padronizadas e limpas para o frontend renderizar as mensagens em vermelho.
- **Frontend Responsivo:** Construído de modo responsivo (Mobile-First) com as melhores práticas de layout Tailwind.
- **Data e Hora:** Uso da biblioteca `date-fns` no frontend para cálculos precisos e manipulação do fuso-horário ISO-8601 de ponta a ponta.

---
*Projeto desenvolvido como case prático de seleção e habilitação técnica.*
