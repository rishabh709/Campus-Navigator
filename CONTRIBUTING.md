# Initial Setup 
Starting from scratch, follow these steps to set up local repository:

0. go to terminal
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
    ```bash
    git remote add upstream https://github.com/rishabh709/Campus-Navigator.git
    ```
4. Create local develop branch
    ```bash
    git checkout -b branch
    push origin main
    ```
4. **Set `develop` as the default branch for PRs** on GitHub:
    - Go to your repo → Settings → Branches → Default branch → set to `develop`.


# How to Contribute

A simple step-by-step guide to help you get started:

1. **Find an Issue**  
   Browse the [Issues](https://github.com/rishabh709/Campus-Navigator/issues) page to find tasks you want to work on. Look for labels and its description.

2. **Claim the Issue**  
   Comment on the issue or assign it to yourself to let others know you’re working on it. You(Contributors) can assign it to yourself by clicking on Assign yourself option under the Assignees in top right corner of the issue.
   
### 1. Fork the repository (as mentioned in Initial Setup)

- Contributor forks the owner’s repo on GitHub.
    
- Their fork has the same branches: `main` and `develop`.
    

---

### 2. Sync fork regularly

- Fetch from upstream:
    
    ```bash
    git fetch upstream
    ```
    
- Sync `develop` branch (usually contributors base their work off `develop`):
    
    ```bash
    git checkout develop
    git reset --hard upstream/develop
    git push origin develop --force  # only if needed
    ```
    
- Also, keep `main` synced if you want:
    
    ```bash
    git checkout main
    git reset --hard upstream/main
    git push origin main --force  # only if needed
    ```
    

---

### 3. Create a feature branch off `develop`

- Create a new branch for your work (feature or bugfix):
    
    ```bash
    git checkout develop
    git pull upstream develop      # make sure it’s up-to-date
    git checkout -b feature/my-new-feature
    ```
    
- Do your work, commit changes:
    
    ```bash
    git add .
    git commit -m "feat(): Add new feature"
    ```
    
- Push your feature branch to your fork:
    
    ```bash
    git push origin feature/my-new-feature
    ```
    

---

### 4. Open a Pull Request (PR)

- Go to **GitHub** on your fork.
    
- Open a PR **from your feature branch** (e.g., `feature/my-new-feature`) **into the owner repo’s `develop` branch** (or whichever branch owner wants).
    
- Make sure PR targets `develop` branch if that’s where ongoing development happens.
    

---

### 5. After PR is merged or closed

- If merged, you can delete your feature branch both locally and remotely:
    
    ```bash
    git branch -d feature/my-new-feature
    git push origin --delete feature/my-new-feature
    ```
    
- If closed or discarded, delete feature branch as above.
    
- Sync your fork’s `develop` and `main` as needed.
    

</br>


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
