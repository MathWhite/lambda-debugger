# 🧩 Lambda Debugger

> Ferramenta local para simular execuções de **transformation.js** com entradas personalizadas, tabelas KVM e armazenamento dinâmico.

---

## 🚀 Instalação

```bash
git clone https://github.com/MathWhite/lambda-debugger.git
cd lambda-debugger
npm install
```

---

## ⚙️ Configuração do `.env`

1. Crie um arquivo **`.env`** na raiz do projeto:

```env
APP_KEY_VTEX=seu_app_key
APP_TOKEN_VTEX=seu_app_token
```

2. **Proteja** seus segredos adicionando o arquivo ao `.gitignore`:

```bash
echo ".env" >> .gitignore
```

---

## 📂 Estrutura de pastas

| Pasta              | Descrição                                                             |
|--------------------|-----------------------------------------------------------------------|
| `inputs/`          | Arquivos de entrada para simulação de chamadas                        |
| `kvm/`             | Tabelas Key‑Value (KVM) simuladas                                     |
| `dynamics/`        | Armazenamentos dinâmicos simulados                                    |
| `code_functions/`  | Funções auxiliares usadas via `execFunctionAsync`                     |

> Arquivos **exemplo** já estão disponíveis em cada pasta para facilitar os testes.

---

## 🧠 Uso

Toda a lógica principal deve estar em **`transformation.js`**.  
Para executar a transformação com os mocks locais, rode:

```bash
node index.js
```

---

## ✅ Requisitos

- **Node.js 14+** (recomenda‑se a versão LTS mais recente)

---

## 🔄 Atualizar o projeto

```bash
git pull
```

---

## 📝 Licença

MIT

Feito com ❤️ por **Matheus Carvalho e Victor Dourado**