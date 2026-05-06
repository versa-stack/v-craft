# Contribution Guide for @versa-stack/v-craft

Thank you for considering contributing to @versa-stack/v-craft! We welcome contributions from the community to help improve the project. Please follow these guidelines to ensure a smooth contribution process.

## How to Contribute

### 1. Fork the Repository

Start by forking the repository on GitHub. This creates a copy of the project in your own GitHub account.

### 2. Clone Your Fork

Clone your forked repository to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/v-craft.git
cd v-craft
```

### 3. Create a New Branch

Create a new branch for your feature or bug fix:

```bash
git checkout -b my-feature-branch
```

### 4. Make Your Changes

Make the necessary changes in your local repository. Be sure to follow the project's coding conventions and best practices.

### 5. Test Your Changes

Run the tests to ensure that everything works as expected:

```bash
npm run test
```

### 6. Commit Your Changes

Once you're satisfied with your changes, commit them with a descriptive message:

```bash
git add .
git commit -m "Add a brief description of your changes"
```

### 7. Push Your Changes

Push your changes to your forked repository:

```bash
git push origin my-feature-branch
```

### 8. Create a Pull Request

Navigate to the original repository on GitHub and create a pull request from your feature branch. Provide a clear description of what you've done and why it should be merged.

## Release Process

This project uses semantic-release for automated versioning and publishing. The release process is configured to publish to different npm channels based on the branch.

### Release Channels

- **develop branch** → alpha channel (e.g., `0.8.0-alpha.1`, `0.8.0-alpha.2`)
- **beta branch** → beta channel (e.g., `0.8.0-beta.1`, `0.8.0-beta.2`)
- **main branch** → stable channel (e.g., `0.8.0`, `0.8.1`)
- **Maintenance branches** (e.g., `0.8.x`) → stable channel (automatic patch releases)

### Workflow

1. **Development**: Work on the `develop` branch. Commits trigger alpha releases automatically.
2. **Beta testing**: Merge `develop` to `beta`. Commits trigger beta releases automatically.
3. **Stable release**: Merge `beta` to `main`. Commits trigger stable releases automatically.

### Maintenance Branches (LTS)

After a stable release (e.g., `v0.8.0`), you can create a maintenance branch for long-term support:

```bash
git checkout -b 0.8.x
git push origin 0.8.x
```

Commits to maintenance branches (e.g., `0.8.x`, `1.x`, `2.0.x`) trigger automatic stable patch releases (e.g., `0.8.1`, `0.8.2`). No manual tags are needed for maintenance branches.

### Version Increment Rules

Semantic-release determines version increments based on conventional commit types:

- **`feat:`** → minor version increment (0.8.0 → 0.9.0)
- **`fix:`** → patch version increment (0.8.0 → 0.8.1)
- **`BREAKING CHANGE:`** (in footer) or `feat!`, `fix!` → major version increment (0.8.0 → 1.0.0)

Example commits:
```bash
git commit -m "feat: add new component"  # Triggers 0.8.0 → 0.9.0
git commit -m "fix: resolve styling bug"  # Triggers 0.8.0 → 0.8.1
git commit -m "feat!: breaking API change"  # Triggers 0.8.0 → 1.0.0
```

## Guidelines for Contributions

    - Code Style: Follow the existing code style and conventions used in the project.
    - Documentation: If you add new features or make significant changes, please update the documentation accordingly.
    - Issues: Before creating a new issue, check if it already exists. If you find an issue, feel free to comment or contribute to it.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Thank you for your contributions!
