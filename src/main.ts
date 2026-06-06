import './scss/style.scss'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Field {
  input: HTMLInputElement
  errorEl: HTMLSpanElement
  group: HTMLElement
  validate: (value: string) => string | null
}

function createField(
  inputId: string,
  validate: (value: string) => string | null
): Field {
  const input = document.getElementById(inputId) as HTMLInputElement
  const errorId = input.getAttribute('aria-describedby')!
  const errorEl = document.getElementById(errorId) as HTMLSpanElement
  const group = input.closest('.form__group') as HTMLElement
  return { input, errorEl, group, validate }
}

function setError(field: Field, message: string): void {
  field.group.classList.add('form__group--error')
  field.errorEl.textContent = message
}

function clearError(field: Field): void {
  field.group.classList.remove('form__group--error')
  field.errorEl.textContent = ''
}

function validateField(field: Field): boolean {
  const error = field.validate(field.input.value.trim())
  if (error !== null) {
    setError(field, error)
    return false
  }
  clearError(field)
  return true
}

const fields: Field[] = [
  createField('first-name', (v) =>
    v === '' ? 'First Name cannot be empty' : null
  ),
  createField('last-name', (v) =>
    v === '' ? 'Last Name cannot be empty' : null
  ),
  createField('email', (v) => {
    if (v === '') return 'Email Address cannot be empty'
    if (!EMAIL_REGEX.test(v)) return 'Looks like this is not an email'
    return null
  }),
  createField('password', (v) =>
    v === '' ? 'Password cannot be empty' : null
  ),
]

fields.forEach((field) => {
  field.input.addEventListener('input', () => {
    if (field.group.classList.contains('form__group--error')) {
      clearError(field)
    }
  })
})

const form = document.getElementById('signup-form') as HTMLFormElement

form.addEventListener('submit', (e) => {
  e.preventDefault()
  // map (pas every) pour valider tous les champs avant de décider
  const isValid = fields.map(validateField).every(Boolean)
  if (isValid) {
    form.reset()
  }
})
