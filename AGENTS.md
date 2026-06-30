## Scope
- Repo currently has no source files, manifests, configs, workflows, or existing agent instructions. Do not assume framework, package manager, build tool, or test runner exists.
- Only verified product requirement so far: build simple interactive game about fractions for grade 4 elementary students using `html`, `css`, and `js`.

## Working Rules
- Prefer plain static files first: `index.html`, `style.css`, `script.js`, plus assets only if needed. Avoid adding Node-based tooling unless repo gains explicit need.
- Keep language, interactions, and visuals age-appropriate for grade 4 students.
- Because repo has no executable checks yet, verify changes in smallest direct way available, such as opening `index.html` in browser or using simple static serving if later added.

## Agent Notes
- Treat user prompt as current source of truth for project direction until repo contains stronger executable or documented guidance.
- If future files add commands, tooling, or conventions, update this file to replace assumptions with verified repo facts.
