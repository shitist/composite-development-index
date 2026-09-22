export function bindComparePicker(picker, onSelect) {
  const input = picker.querySelector("input");
  const toggle = picker.querySelector(".country-picker__toggle");
  const menu = picker.querySelector(".country-picker__menu");
  const list = picker.querySelector(".country-picker__options");
  const empty = picker.querySelector(".country-picker__empty");
  const options = [...picker.querySelectorAll("[data-add-code]")];
  let active = -1;
  const visible = () => options.filter(option => !option.hidden);

  function highlight(index) {
    const items = visible();
    active = index;
    options.forEach(option => option.classList.remove("is-active"));
    const option = items[index];
    if (!option) { input.removeAttribute("aria-activedescendant"); return; }
    option.classList.add("is-active");
    input.setAttribute("aria-activedescendant", option.id);
    const top = option.offsetTop - list.offsetTop;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (top + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = top + option.offsetHeight - list.clientHeight;
    }
  }
  function filter() {
    const query = input.value.trim().toLocaleLowerCase();
    options.forEach(option => { option.hidden = !option.dataset.search.includes(query); });
    empty.hidden = visible().length > 0;
    highlight(-1);
    list.scrollTop = 0;
  }
  function open() {
    if (input.disabled) return;
    menu.hidden = false;
    input.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-expanded", "true");
  }
  function close() {
    menu.hidden = true;
    input.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-expanded", "false");
    input.value = "";
    filter();
  }
  input.addEventListener("focus", open);
  input.addEventListener("click", open);
  input.addEventListener("input", () => { open(); filter(); });
  input.addEventListener("keydown", event => {
    if (event.isComposing) return;
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      open();
      const count = visible().length;
      if (count) highlight(active < 0 ? (event.key === "ArrowDown" ? 0 : count - 1) : (active + (event.key === "ArrowDown" ? 1 : -1) + count) % count);
    }
    if (event.key === "Enter" && !menu.hidden) {
      event.preventDefault();
      const option = visible()[Math.max(active, 0)];
      if (option) onSelect(option.dataset.addCode);
    }
  });
  toggle.addEventListener("click", () => {
    if (!menu.hidden) close();
    else { input.focus(); open(); }
  });
  options.forEach(option => option.addEventListener("click", () => onSelect(option.dataset.addCode)));
  picker.addEventListener("focusout", event => {
    if (!picker.contains(event.relatedTarget)) close();
  });
  const outside = event => { if (!picker.contains(event.target)) close(); };
  document.addEventListener("pointerdown", outside);
  return () => document.removeEventListener("pointerdown", outside);
}
