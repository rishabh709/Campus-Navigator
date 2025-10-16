# Initial Setup 
Starting from scratch, follow these steps to set up local repository:
1. clone the repository

    ```bash
    git clone https://github.com/rishabh709/Campus-Navigator.git
    ```
2. Set your repo as the correct origin
    ```bash
    git remote add upstream https://github.com/rishabh709/Campus-Navigator.git
    ```
3. Fork the main repo
    1. Go to the github repo https://github.com/rishabh709/Campus-Navigator.git and click on fork
    2. Copy or forked repo looking like `(https://github.com/<username>/Campus-Navigator.git)`
    3. go to vs code terminal
    ```bash
    git remote set-url origin  https://github.com/rishabh709/Campus-Navigator.git
    ```
4. **Set `develop` as the default branch for PRs** on GitHub:
    - Go to your repo → Settings → Branches → Default branch → set to `develop`.


# How to Contribute

A simple step-by-step guide to help you get started:

1. **Find an Issue**  
   Browse the [Issues](https://github.com/rishabh709/Campus-Navigator/issues) page to find tasks you want to work on. Look for labels and its description.

2. **Claim the Issue**  
   Comment on the issue or assign it to yourself to let others know you’re working on it. You(Contributors) can assign it to yourself by clicking on Assign yourself option under the Assignees in top right corner of the issue.
   
3. Open your terminal in VS Code  
    ```
    git fetch origin
    git checkout develop
    ```
4. Pull the latest changes from the remote repository:

    ```bash
    git pull origin develop
    ```
5. create correct branch as per the issue:

    ```bash
    git checkout -b feature/<feature-name>
    ```


6. Start making your changes  
7. Test your Changes

8. Stage changes for commit:

    To stage a specific file:

    ```bash
    git add <filename>
    ```

    To stage all changed files:

    ```bash
    git add .
    ```
9. Commit your changes with a meaningful message:

    ```bash
    git commit -m "type(scope): short description"
    ```

    > Example:  
    > `git commit -m "feat(nav-bar): create nav bar"`

9. Push your commits to the remote branch:

    ```bash
    git push -u origin feature/<feature-name>
    ```

10. Create the Pull Request on GitHub: 
    1. Go to your github forked repo of the project
    2. Click on contribute -> Open pull request
    3. When opening a PR, GitHub will ask:
        - “Compare” branch: This should be feature/nav-bar (their branch).
        - “Base” branch: This should be develop (the branch they want to merge into).
        - They must choose develop as the base branch explicitly if it’s not pre-selected.

    4. Add appropriate title and description (mention What and why but not how changes are made?)
    5. Request reviewer



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
