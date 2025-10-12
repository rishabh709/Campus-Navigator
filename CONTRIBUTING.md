# Initial Setup 
Starting from scratch, follow these steps to set up local repository:
1. clone the repository

    ```bash
    git clone https://github.com/rishabh709/Campus-Navigator.git
    ```
2. Set your repo as the correct origin
    ```bash
    git remote set-url origin https://github.com/rishabh709/Campus-Navigator.git
    ```

# Developement Workflow (IMPORTANT)

Before starting any new work:

1. Open your terminal in VS Code  
2. Switch to the correct branch (usually `develop`):

    ```bash
    git checkout develop
    ```

3. Pull the latest changes from the remote repository:

    ```bash
    git pull origin develop
    ```

4. Start making your changes  
5. Stage changes for commit:

    To stage a specific file:

    ```bash
    git add <filename>
    ```

    To stage all changed files:

    ```bash
    git add .
    ```
6. Commit your changes with a meaningful message:

    ```bash
    git commit -m "type(scope): short description"
    ```

    > Example:  
    > `git commit -m "docs(contributing): add syncing workflow section"`

7. Push your commits to the remote branch:

    ```bash
    git push origin develop
    ```



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
