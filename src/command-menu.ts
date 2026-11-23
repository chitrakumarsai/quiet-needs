import { toggleTheme } from './theme.ts';

export const commandEvent = 'quietneeds-command';
export const commandPaths = { request: '/card', create: '/events/new', join: '/join' } as const;
type Command = keyof typeof commandPaths | 'theme';

const entries = [
  { id: 'request', label: 'New request', icon: '<path d="M12 5v14M5 12h14"/>' },
  { id: 'create', label: 'Create event', icon: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18m-9 3v5m-2.5-2.5h5"/>' },
  { id: 'join', label: 'Join event', icon: '<path d="M4 8h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4zM13 8v2m0 4v4"/>' },
  { id: 'theme', label: 'Toggle theme', icon: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18"/>' },
] as const;

export function mountCommandMenu() {
  let open: (() => void) | undefined;
  const shortcut = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
  document.querySelectorAll('[data-command-shortcut]').forEach(chip => { chip.textContent = shortcut; });
  document.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('[data-open-command]')) show();
  });
  document.addEventListener('keydown', event => {
    if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
    if (document.querySelector('dialog[open]:not(.command-menu)')) return;
    event.preventDefault();
    show();
  });

  function show() {
    if (!open) open = createMenu();
    open();
  }

  function createMenu() {
    const dialog = document.createElement('dialog');
    dialog.id = 'command-menu';
    dialog.className = 'command-menu';
    dialog.setAttribute('aria-labelledby', 'command-title');
    dialog.innerHTML = `<h2 class="visually-hidden" id="command-title">Command menu</h2>
      <div class="command-search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
        <input type="search" name="command-search" aria-label="Search commands" placeholder="Search commands…" autocomplete="off" spellcheck="false" autofocus>
        <button type="button" class="ghost" aria-label="Close command menu"><kbd>Esc</kbd></button>
      </div>
      <div class="command-results">${entries.map(entry => `<button type="button" data-action="${entry.id}">
        <svg viewBox="0 0 24 24" aria-hidden="true">${entry.icon}</svg>${entry.label}</button>`).join('')}
        <p role="status" hidden>No matching commands.</p>
      </div>
      <div class="command-hints"><span><kbd>↑</kbd> <kbd>↓</kbd> Move</span><span><kbd>↵</kbd> Run</span></div>`;
    document.body.append(dialog);
    const trigger = document.querySelector('[data-open-command]');
    trigger?.setAttribute('aria-controls', dialog.id);
    dialog.addEventListener('close', () => trigger?.setAttribute('aria-expanded', String(dialog.open)));
    const search = dialog.querySelector('input')!;
    const commands = Array.from(dialog.querySelectorAll<HTMLButtonElement>('button[data-action]'));
    const empty = dialog.querySelector('p')!;

    function filter() {
      const query = search.value.trim().toLowerCase();
      commands.forEach(button => { button.hidden = !button.textContent!.trim().toLowerCase().includes(query); });
      empty.hidden = commands.some(button => !button.hidden);
    }

    search.addEventListener('input', filter);
    dialog.querySelector<HTMLButtonElement>('.command-search button')!.onclick = () => dialog.close();
    commands.forEach(button => {
      button.onclick = () => {
        const command = button.dataset.action as Command;
        dialog.close();
        if (command === 'theme') toggleTheme();
        else if (window.dispatchEvent(new CustomEvent(commandEvent, { detail: command, cancelable: true }))) {
          location.assign(commandPaths[command]);
        }
      };
    });
    dialog.addEventListener('keydown', event => {
      const visible = commands.filter(button => !button.hidden);
      if (event.key === 'Enter' && event.target === search && visible.length) {
        event.preventDefault();
        visible[0].click();
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      const active = visible.findIndex(button => button === document.activeElement);
      if (event.key === 'ArrowDown') (visible[active + 1] ?? search).focus();
      else (active < 0 ? visible.at(-1) ?? search : visible[active - 1] ?? search).focus();
    });
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });

    return () => {
      if (dialog.open) { dialog.close(); return; }
      search.value = '';
      filter();
      dialog.showModal();
      trigger?.setAttribute('aria-expanded', 'true');
      search.focus();
    };
  }
}
