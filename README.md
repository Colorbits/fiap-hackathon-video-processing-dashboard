# Documentação - Fiap Hackathon Video Processing Dashboard
### Grupo 5 - 9SOAT
 - Gabriel Ferreira Umbelino

## Introdução
Este projeto é o frontend do sistema de processamento de vídeos, responsável por fornecer uma interface gráfica intuitiva e eficiente para os usuários interagirem com o ecossistema de processamento de vídeos. O dashboard permite que os usuários se cadastrem, façam login, enviem vídeos para processamento, acompanhem o status de seus vídeos e visualizem os frames extraídos.

Desenvolvido com React e Vite, o dashboard oferece uma experiência de usuário moderna e responsiva, integrando-se perfeitamente com os microserviços do backend para fornecer funcionalidades como upload de vídeos, visualização de frames extraídos, seleção de thumbnails e download de resultados.

O projeto utiliza uma arquitetura de contextos para gerenciamento de estado global, hooks personalizados para lógica reutilizável e services para encapsular as chamadas à API, resultando em um código organizado, modular e de fácil manutenção.

## Escopo do Sistema

### Autenticação e Gestão de Usuários
- Sistema completo de acesso:
  - Registro de novos usuários
  - Login e autenticação segura
  - Gerenciamento de sessão

### Interface de Upload e Gerenciamento de Vídeos
- Sistema intuitivo de envio e gerenciamento:
  - Upload de vídeos com feedback visual de progresso
  - Listagem de todos os vídeos enviados
  - Visualização detalhada de cada vídeo

### Visualização e Manipulação de Frames
- Ferramentas para trabalhar com os frames extraídos:
  - Visualização dos frames extraídos de cada vídeo
  - Seleção de frames como thumbnails
  - Interface para navegação entre frames

### Monitoramento de Status
- Acompanhamento em tempo real:
  - Indicadores visuais de status do processamento
  - Atualização automática de status
  - Notificações de conclusão ou erros

## Diagramas

### Arquitetura de Componentes
![Arquitetura de Componentes](https://github.com/Colorbits/fiap-hackathon-video-processing-dashboard/blob/main/docs/component-architecture.png?raw=true)

O dashboard segue uma arquitetura moderna de componentes React, focada em modularidade e reusabilidade:

#### Camadas da Aplicação

1. **Componentes de Apresentação**
   - Elementos visuais reutilizáveis (botões, cards, inputs)
   - Responsáveis apenas por renderizar UI e capturar interações

2. **Componentes de Container**
   - Agregam componentes de apresentação
   - Gerenciam estado local e lógica específica da página

3. **Contextos**
   - Gerenciam estado global da aplicação
   - Fornecem dados e funções para componentes em diferentes níveis

4. **Serviços**
   - Encapsulam comunicação com APIs
   - Gerenciam detalhes de autenticação e formato de dados

5. **Hooks Personalizados**
   - Extraem lógica reutilizável
   - Simplificam componentes ao separar lógica de apresentação

### Fluxo de Dados

![Fluxo de Dados](https://github.com/Colorbits/fiap-hackathon-video-processing-dashboard/blob/main/docs/data-flow.png?raw=true)

## Dicionário de Linguagem Ubíqua

- **Dashboard**: Interface principal que exibe informações e controles para o usuário.

- **Vídeo**: Arquivo multimídia enviado pelo usuário para processamento e extração de frames.

- **Frame**: Imagem individual extraída de um vídeo em um momento específico.

- **Thumbnail**: Imagem representativa usada como prévia de um vídeo.

- **Upload**: Processo de envio de um vídeo do dispositivo do usuário para o sistema.

- **Status de Processamento**: Estado atual de um vídeo (pendente, processando, concluído, erro).

- **Contexto**: Mecanismo para compartilhar estados e funções entre componentes sem prop drilling.

- **Service**: Módulo que encapsula a lógica de comunicação com APIs externas.

- **Token de Autenticação**: Credencial que identifica um usuário autenticado no sistema.

- **Mock**: Dados simulados usados quando a API real não está disponível.

## Tech Stack

- React 18+
- TypeScript
- Vite (build tool)
- Context API para gerenciamento de estado
- Axios para requisições HTTP
- React Router para navegação
- CSS Modules para estilização
- Vitest para testes
- ESLint e Prettier para qualidade de código
- Docker para containerização
- Vercel/Netlify para deploy

## Instalação do Projeto

### Pré-requisitos

- Node.js 16+ instalado
- NPM ou Yarn

### Configuração Local

#### 1 - Clone o repositório
```bash
# Clone o repositório
git clone https://github.com/Colorbits/fiap-hackathon-video-processing-dashboard.git

# Entre no diretório do projeto
cd fiap-hackathon-video-processing-dashboard
```

#### 2 - Instale as dependências
```bash
# Usando npm
npm install

# OU usando yarn
yarn
```

#### 3 - Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
VITE_API_URL=http://localhost:3000
VITE_IMAGE_API_URL=http://localhost:3001/api
```

Ajuste as URLs conforme a configuração do seu ambiente de backend.

#### 4 - Inicie o servidor de desenvolvimento
```bash
# Usando npm
npm run dev

# OU usando yarn
yarn dev
```

Acesse o dashboard em: [http://localhost:5173](http://localhost:5173)

### Kubernetes
Para executar todo o ecossistema (frontend + backend) em Kubernetes, siga estas instruções:

#### Pré-requisitos
- Kubernetes instalado (minikube, kind, ou qualquer outro cluster)
- kubectl configurado
- Git instalado

#### 1 - Clone o repositório de configurações Kubernetes
```bash
# Clone o repositório com as configurações Kubernetes
git clone https://github.com/Colorbits/fiap-hackathon-k8s.git

# Entre no diretório do projeto
cd fiap-hackathon-k8s
```

#### 2 - Aplique as configurações Kubernetes
```bash
# Aplique todos os manifestos Kubernetes de uma vez
kubectl apply -f ./kubernetes

# Alternativamente, você pode aplicar os manifestos individualmente
# kubectl apply -f ./kubernetes/namespace.yaml
# kubectl apply -f ./kubernetes/video-processing-dashboard.yaml
# kubectl apply -f ./kubernetes/video-processing-api.yaml
# kubectl apply -f ./kubernetes/image-upload-service.yaml
```

#### 3 - Verifique se os pods estão rodando corretamente
```bash
# Verifique o status de todos os pods
kubectl get pods -n fiap-hackathon

# Verifique logs do dashboard
kubectl logs -f pod/video-processing-dashboard-pod-name -n fiap-hackathon
```

#### 4 - Acesse o dashboard
```bash
# Obtenha o endereço do serviço do dashboard
kubectl get services -n fiap-hackathon
```

Acesse o dashboard no endereço fornecido pelo serviço [http://localhost:3000](http://localhost:3000))

#### 5 - Limpeza (quando terminar)
```bash
# Remova todos os recursos quando não precisar mais do ambiente
kubectl delete -f ./kubernetes
```

## Estrutura do Projeto

```
fiap-hackathon-video-processing-dashboard/
├── public/              # Arquivos estáticos públicos
├── src/                 # Código fonte
│   ├── components/      # Componentes React reutilizáveis
│   │   ├── layout/      # Componentes de layout (header, footer, etc)
│   │   ├── upload/      # Componentes para upload de vídeo
│   │   ├── video/       # Componentes relacionados a vídeos
│   │   └── videoFrames/ # Componentes para exibição de frames
│   ├── contexts/        # Contextos React para gerenciamento de estado global
│   ├── hooks/           # Hooks personalizados
│   ├── mocks/           # Dados simulados para desenvolvimento offline
│   ├── pages/           # Componentes de página completa
│   │   ├── dashboard/   # Página principal do dashboard
│   │   ├── login/       # Página de login/registro
│   │   ├── videos/      # Página de listagem de vídeos
│   │   └── videoDetail/ # Página de detalhes de vídeo
│   ├── routes/          # Configuração de rotas
│   ├── services/        # Serviços para comunicação com APIs
│   ├── utils/           # Utilitários e funções auxiliares
│   ├── App.jsx          # Componente raiz da aplicação
│   ├── main.jsx         # Ponto de entrada da aplicação
│   └── index.css        # Estilos globais
├── .env                 # Variáveis de ambiente padrão
├── .eslintrc.js         # Configuração do ESLint
├── package.json         # Dependências e scripts
├── tsconfig.json        # Configuração do TypeScript
└── vite.config.js       # Configuração do Vite
```

## Desenvolvimento

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila o projeto para produção
- `npm run preview`: Serve a versão compilada localmente
- `npm run lint`: Executa o linter para verificar problemas de código
- `npm run test`: Executa os testes unitários
- `npm run test:coverage`: Executa testes com relatório de cobertura

### Padrões de Código

O projeto segue padrões rigorosos de código para manter a qualidade e consistência:

- **Componentes**: Preferencialmente funcionais, usando hooks para gerenciar estado
- **Tipagem**: TypeScript para garantir tipagem estática
- **Estilização**: CSS Modules ou styled-components para estilos isolados
- **Nomenclatura**: PascalCase para componentes, camelCase para funções e variáveis
- **Estado Global**: Context API para gerenciamento de estado compartilhado
- **Testes**: Componentes críticos devem ter testes unitários

### Principais Funcionalidades

1. **Autenticação**
   - Login com email/senha
   - Cadastro de novos usuários
   - Recuperação de senha

2. **Dashboard**
   - Visão geral dos vídeos processados
   - Estatísticas de processamento

3. **Upload de Vídeos**
   - Interface drag-and-drop
   - Progresso de upload
   - Feedback visual

4. **Listagem de Vídeos**
   - Thumbnails e informações básicas
   - Filtros e ordenação
   - Indicadores de status

5. **Detalhes do Vídeo**
   - Reprodução do vídeo original
   - Acesso aos frames extraídos
   - Seleção de thumbnail
   - Download de frames

6. **Visualização de Frames**
   - Navegação entre frames
   - Seleção de frames específicos

## Integração com Backend

O dashboard se integra com os seguintes serviços de backend:

1. **API Core** (`fiap-hackathon-video-processing-api-core`)
   - Autenticação e gerenciamento de usuários
   - Upload de vídeos
   - Informações sobre status de processamento

2. **Image Upload Service** (`fiap-hackathon-image-upload-service`)
   - Acesso aos frames extraídos
   - Gerenciamento de thumbnails
   - Download de imagens processadas

O diagrama de comunicação entre o frontend e os serviços backend está disponível [aqui](https://github.com/Colorbits/fiap-hackathon-video-processing-dashboard/blob/main/docs/backend-communication.png).

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie um branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
