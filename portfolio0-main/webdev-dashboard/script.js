'use strict';

// 第1回〜第15回の主な学習内容
const lessons = [
  ['第1回','Linuxと仮想環境','Ubuntu、Multipass、OS、apt'],
  ['第2回','Linux基本操作','pwd、ls、cd、mkdir、cp、mv、rm'],
  ['第3回','標準入出力','リダイレクト、パイプ、grep、cat、less'],
  ['第4回','Vim','モード切替、編集、保存、検索'],
  ['第5回','Shellとネットワーク','シェルスクリプト、IP、TCP、ping'],
  ['第6回','HTTPとサーバー','クライアント、DNS、HTTP、簡易サーバー'],
  ['第7回','APIと自動化','curl、JSON、cron、Bot'],
  ['第8回','GitHub機能','Issue、Wiki、Gist、Markdown'],
  ['第9回','Git基礎','clone、pull、add、commit、push、SSH'],
  ['第10回','Git共同開発','branch、merge、conflict、Pull Request'],
  ['第11回','DockerとNode.js','コンテナ、Compose、Node.js、テスト'],
  ['第12回','アルゴリズムと集計','計算量、メモ化、CSV、Map、sort'],
  ['第13回','ライブラリとSlack Bot','yarn、module.exports、Bolt、環境変数'],
  ['第14回','TODOと自動テスト','CRUD、filter、map、findIndex、node:test'],
  ['第15回','Bot連携とリファクタリング','TDD、正規表現、TODO Bot']
];

const lessonGrid = document.getElementById('lesson-grid');
lessons.forEach(([number, title, description]) => {
  const card = document.createElement('article');
  card.className = 'lesson-card';
  card.innerHTML = `<span class="number">${number}</span><h3>${title}</h3><p>${description}</p>`;
  lessonGrid.appendChild(card);
});

// Linux・Git・Docker・Node.jsのコマンド検索
const commands = [
  ['pwd','現在のディレクトリを表示'],
  ['ls','ファイル・ディレクトリの一覧を表示'],
  ['cd','ディレクトリを移動'],
  ['mkdir','ディレクトリを作成'],
  ['cp','ファイルやディレクトリをコピー'],
  ['mv','ファイルの移動・名前変更'],
  ['rm','ファイルやディレクトリを削除'],
  ['find','ファイルやディレクトリを検索'],
  ['grep','文字列を検索'],
  ['cat','ファイル内容を表示'],
  ['less','長い内容をページ単位で表示'],
  ['chmod','ファイル権限を変更'],
  ['curl','URLへアクセスしてデータを取得'],
  ['ping','通信先への到達性を確認'],
  ['git clone','リモートリポジトリを複製'],
  ['git pull','リモートの変更を取得'],
  ['git add','変更をステージング'],
  ['git commit','変更履歴を記録'],
  ['git push','変更をリモートへ送信'],
  ['git branch','ブランチを確認・作成'],
  ['docker compose up','Composeでコンテナを起動'],
  ['docker compose down','Composeでコンテナを停止・削除'],
  ['node','Node.jsでJavaScriptを実行'],
  ['yarn test','登録されたテストを実行']
];

const commandSearch = document.getElementById('command-search');
const commandList = document.getElementById('command-list');

function renderCommands(keyword = '') {
  const word = keyword.toLowerCase().trim();
  const result = commands.filter(([command, description]) =>
    `${command} ${description}`.toLowerCase().includes(word)
  );

  commandList.innerHTML = '';

  if (result.length === 0) {
    commandList.innerHTML = '<p class="empty">一致するコマンドがありません。</p>';
    return;
  }

  result.forEach(([command, description]) => {
    const item = document.createElement('div');
    item.className = 'command-item';
    item.innerHTML = `<code>${command}</code><span>${description}</span>`;
    commandList.appendChild(item);
  });
}

commandSearch.addEventListener('input', () => renderCommands(commandSearch.value));
renderCommands();

// CRUD型TODO
const STORAGE_KEY = 'portfolio-webdev-todos';
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let currentFilter = 'all';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoEmpty = document.getElementById('todo-empty');
const progressValue = document.getElementById('progress-value');
const progressText = document.getElementById('progress-text');
const filterButtons = document.querySelectorAll('.filter');

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function addTodo(name) {
  todos.push({ id: Date.now(), name, isDone: false });
  saveTodos();
}

function toggleDone(id) {
  const indexFound = todos.findIndex(todo => todo.id === id);
  if (indexFound !== -1) {
    todos[indexFound].isDone = !todos[indexFound].isDone;
    saveTodos();
  }
}

function delTodo(id) {
  const indexFound = todos.findIndex(todo => todo.id === id);
  if (indexFound !== -1) {
    todos.splice(indexFound, 1);
    saveTodos();
  }
}

function visibleTodos() {
  if (currentFilter === 'active') return todos.filter(todo => !todo.isDone);
  if (currentFilter === 'done') return todos.filter(todo => todo.isDone);
  return todos;
}

function renderTodos() {
  const list = visibleTodos();
  todoList.innerHTML = '';

  list.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.isDone ? ' done' : ''}`;

    const done = document.createElement('button');
    done.className = 'done-button';
    done.textContent = todo.isDone ? '戻す' : '完了';
    done.addEventListener('click', () => {
      toggleDone(todo.id);
      renderTodos();
    });

    const name = document.createElement('span');
    name.className = 'todo-name';
    name.textContent = todo.name;

    const del = document.createElement('button');
    del.className = 'delete-button';
    del.textContent = '削除';
    del.addEventListener('click', () => {
      delTodo(todo.id);
      renderTodos();
    });

    li.append(done, name, del);
    todoList.appendChild(li);
  });

  todoEmpty.style.display = list.length === 0 ? 'block' : 'none';

  const doneCount = todos.filter(todo => todo.isDone).length;
  const percent = todos.length === 0 ? 0 : doneCount / todos.length * 100;
  progressValue.style.width = `${percent}%`;
  progressText.textContent = `${doneCount} / ${todos.length} 完了`;
}

todoForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = todoInput.value.trim();
  if (!name) return;
  addTodo(name);
  todoInput.value = '';
  renderTodos();
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    renderTodos();
  });
});

renderTodos();

// GitHub REST API
const githubForm = document.getElementById('github-form');
const githubOwner = document.getElementById('github-owner');
const githubRepo = document.getElementById('github-repo');
const githubResult = document.getElementById('github-result');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}

githubForm.addEventListener('submit', async event => {
  event.preventDefault();

  const owner = githubOwner.value.trim();
  const repo = githubRepo.value.trim();

  githubResult.innerHTML = '<p>取得中です...</p>';

  try {
    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    githubResult.innerHTML = `
      <h3>${escapeHtml(data.full_name)}</h3>
      <p>${escapeHtml(data.description || '説明は登録されていません。')}</p>
      <div class="repo-meta">
        <span>言語: ${escapeHtml(data.language || '未設定')}</span>
        <span>Stars: ${data.stargazers_count}</span>
        <span>Forks: ${data.forks_count}</span>
        <span>Open Issues: ${data.open_issues_count}</span>
      </div>
      <p><a href="${data.html_url}" target="_blank" rel="noopener noreferrer">GitHubで開く</a></p>
    `;
  } catch (error) {
    githubResult.innerHTML =
      '<p>取得できませんでした。公開リポジトリの名前を確認してください。</p>';
  }
});

// 理解度チェック
const quizData = [
  ['Gitで変更をステージングするコマンドは？',['git push','git add','git pull'],1],
  ['HTTPで情報取得に使われる代表的なメソッドは？',['GET','DELETE','PATCH'],0],
  ['Dockerの設定をまとめて管理する仕組みは？',['Vim','Docker Compose','cron'],1],
  ['条件に一致する配列要素だけを取り出すメソッドは？',['filter()','join()','push()'],0],
  ['CRUDのUが表す操作は？',['Upload','Update','User'],1]
];

const quizBox = document.getElementById('quiz-box');
const quizCheck = document.getElementById('quiz-check');
const quizReset = document.getElementById('quiz-reset');
const quizResult = document.getElementById('quiz-result');

function renderQuiz() {
  quizBox.innerHTML = '';
  quizData.forEach(([question, choices], qIndex) => {
    const div = document.createElement('div');
    div.className = 'quiz-question';
    div.innerHTML = `<p>${qIndex + 1}. ${question}</p>`;

    choices.forEach((choice, cIndex) => {
      const label = document.createElement('label');
      label.innerHTML =
        `<input type="radio" name="quiz-${qIndex}" value="${cIndex}"> ${choice}`;
      div.appendChild(label);
    });

    quizBox.appendChild(div);
  });
}

quizCheck.addEventListener('click', () => {
  let score = 0;

  quizData.forEach(([, , answer], index) => {
    const checked = document.querySelector(`input[name="quiz-${index}"]:checked`);
    if (checked && Number(checked.value) === answer) score++;
  });

  quizResult.textContent = `${quizData.length}問中 ${score}問正解です。`;
});

quizReset.addEventListener('click', () => {
  renderQuiz();
  quizResult.textContent = '';
});

renderQuiz();
