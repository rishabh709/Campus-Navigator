# Commit Message Basic Structure:
```
<type>[optional scope]: <description>
```

### 1. Types `<type>`
- 🔧 **fix** – Bug fixes  
- ✨ **feat** – New features  
- 🏗️ **build** – Changes to build system or dependencies  
- 🔄 **chore** – Routine tasks, maintenance, or updates that don’t affect source code  
- 🤖 **ci** – Continuous Integration related changes (e.g., workflows, configs)  
- 📝 **docs** – Documentation updates only  
- 🎨 **style** – Code style, formatting, whitespace, missing semicolons (no code logic changes)  
- ♻️ **refactor** – Code changes that neither fix bugs nor add features (e.g., code cleanup)  
- ✅ **test** – Adding or modifying tests  


### 2. Optional Scope `[optional scope]`
- Mention the specific feature or component you are working on  
- Example: `(Feature)` or `(Login-page)`

### 3. Description `<description>`
- Keep it short and to the point  
- Use **present tense** (e.g., "fix bug" instead of "fixed bug")  
- Don’t explain *how* the changes were made; focus on *what* was changed and *why*  
- Use multiple lines if necessary  


### Example Commit Messages
- `feat(auth): add user registration endpoint`  
- `fix(login): correct password validation`  
- `refactor(api): simplify request handling logic`  
- `docs(readme): update contributing guidelines`  
- `style(ui): standardize button colors`  
- `test(auth): add unit tests for login flow`  
- `chore(deps): update dependencies to latest versions`

### Commit Example
- `git commit -m feat(docs): create CONTRIBUTING.md including commit message structure`
