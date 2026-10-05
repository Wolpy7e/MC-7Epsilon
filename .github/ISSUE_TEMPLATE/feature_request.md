name: "Feature Request"
description: "Suggest a new feature or improvement"
title: "[FEATURE] "
labels: ["enhancement", "feature-request"]
assignees: []
body:
  - type: markdown
    attributes:
      value: |
        Thank you for suggesting a feature! We appreciate community feedback to improve MC-BotDiscord.

  - type: textarea
    id: problem
    attributes:
      label: "Is your feature request related to a problem?"
      description: "Describe the problem you're trying to solve"
      placeholder: "A clear description of the problem..."
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: "Describe the solution"
      description: "How should this feature work?"
      placeholder: "A clear description of the solution..."
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: "Alternative solutions"
      description: "Have you considered other approaches?"
      placeholder: "Other ways to solve this problem..."

  - type: textarea
    id: context
    attributes:
      label: "Additional context"
      description: "Any other context or screenshots?"

  - type: checkboxes
    id: confirmation
    attributes:
      label: "Confirmation"
      options:
        - label: "I have searched for similar feature requests"
          required: true
        - label: "This feature is within scope for MC-BotDiscord"
          required: true
