const STORAGE_KEY = 'ledger_entries_v1';

const form = document.querySelector('#entry-form');
const typeInput = document.querySelector('#type');
const amountInput = document.querySelector('#amount');
const categoryInput = document.querySelector('#category');
const dateInput = document.querySelector('#date');
const noteInput = document.querySelector('#note');
const clearBtn = document.querySelector('#clear-btn');

const incomeTotal = document.querySelector('#income-total');
const expenseTotal = document.querySelector('#expense-total');
const balanceTotal = document.querySelector('#balance-total');
const entryList = document.querySelector('#entry-list');

/** @type {Array<{id:string,type:'income'|'expense',amount:number,category:string,date:string,note:string}>} */
let entries = loadEntries();

if (!dateInput.value) {
  dateInput.value = new Date().toISOString().slice(0, 10);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const amount = Number.parseFloat(amountInput.value);
  if (Number.isNaN(amount) || amount <= 0) {
    alert('请输入大于 0 的金额。');
    return;
  }

  const entry = {
    id: crypto.randomUUID(),
    type: typeInput.value,
    amount,
    category: categoryInput.value.trim(),
    date: dateInput.value,
    note: noteInput.value.trim(),
  };

  entries.unshift(entry);
  persist();
  form.reset();
  dateInput.value = new Date().toISOString().slice(0, 10);
  render();
});

clearBtn.addEventListener('click', () => {
  if (!entries.length) {
    return;
  }

  const confirmed = confirm('确定清空所有记录吗？');
  if (!confirmed) {
    return;
  }

  entries = [];
  persist();
  render();
});

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(value);
}

function renderSummary() {
  const income = entries
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const expense = entries
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = income - expense;

  incomeTotal.textContent = formatCurrency(income);
  expenseTotal.textContent = formatCurrency(expense);
  balanceTotal.textContent = formatCurrency(balance);
}

function renderEntries() {
  entryList.innerHTML = '';

  if (!entries.length) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = '暂无记录，请先添加一条。';
    entryList.append(empty);
    return;
  }

  for (const item of entries) {
    const li = document.createElement('li');
    li.className = 'entry-item';

    const tag = document.createElement('span');
    tag.className = `tag ${item.type}`;
    tag.textContent = item.type === 'income' ? '收入' : '支出';

    const info = document.createElement('div');
    info.innerHTML = `<strong>${item.category}</strong><div class="muted">${item.date}${
      item.note ? ` · ${item.note}` : ''
    }</div>`;

    const amount = document.createElement('span');
    amount.className = 'amount';
    amount.textContent = `${item.type === 'expense' ? '-' : '+'}${formatCurrency(item.amount)}`;

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '删除';
    del.type = 'button';
    del.addEventListener('click', () => {
      entries = entries.filter((entry) => entry.id !== item.id);
      persist();
      render();
    });

    li.append(tag, info, amount, del);
    entryList.append(li);
  }
}

function render() {
  renderSummary();
  renderEntries();
}

render();
