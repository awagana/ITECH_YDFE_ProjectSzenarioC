
# Repository Guidelines

## Before Starting Work

Always pull the latest changes:
```bash-
git pull origin main
```


## Creating a Feature Branch

Create a new branch for each feature or fix:
```bash
git checkout -b feature/your-feature-name
```

Use descriptive names:
- `feature/add-login-validation`
- `bugfix/fix-null-pointer-exception`
- `docs/update-readme`

## Making Changes

1. Make focused, logical commits
2. Write clear commit messages:
```bash
git add .
git commit -m "Add user authentication validation"
```

3. Push frequently to avoid losing work:
```bash
git push origin feature/your-feature-name
```

## Before Merging

1. Ensure your branch is up-to-date:
```bash
git pull origin main
```

2. Resolve any conflicts locally

3. Test your changes thoroughly

4. Create a Pull Request with a clear description