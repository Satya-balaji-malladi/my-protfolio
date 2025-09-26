/* Main interactions: typing tags, projects, skills animation, nav highlight, smooth scroll */

document.addEventListener('DOMContentLoaded', () => {

  /* TYPING TAGS (type -> pause -> erase -> next) */
  const tags = ["Web Developer", "AI Enthusiast", "Content Creator", "B.Tech Student"];
  const typingEl = document.getElementById('typingTags');
  let tIdx = 0, cIdx = 0, deleting = false;
  const typeSpeed = 100, eraseSpeed = 50, pause = 1000;

  function tick() {
    const current = tags[tIdx];
    if (!deleting) {
      cIdx++;
      typingEl.textContent = current.substring(0, cIdx);
      if (cIdx === current.length) {
        deleting = true;
        return setTimeout(tick, pause);
      }
      return setTimeout(tick, typeSpeed);
    } else {
      cIdx--;
      typingEl.textContent = current.substring(0, cIdx);
      if (cIdx === 0) {
        deleting = false;
        tIdx = (tIdx + 1) % tags.length;
        return setTimeout(tick, 200);
      }
      return setTimeout(tick, eraseSpeed);
    }
  }
  tick();

  /* PROJECTS DATA + RENDER */
  const projectsData = {
    web: [
      { title: "Portfolio Website", desc: "Modern portfolio built with HTML/CSS/JS", img: "assets/project1.jpg" },
      { title: "E-commerce Site", desc: "Shop with payment integration", img: "assets/project2.jpg" }
    ],
    ai: [
      { title: "Chatbot AI", desc: "Python chatbot for Q&A", img: "assets/project3.jpg" }
    ],
    mobile: [
      { title: "Safe Zone App", desc: "Women safety app prototype", img: "assets/project4.jpg" }
    ]
  };

  const projectsGrid = document.getElementById('projectsGrid');
  const typeBtns = document.querySelectorAll('.type-btn');

  function renderProjects(type = 'all') {
    projectsGrid.innerHTML = '';
    const items = type === 'all'
      ? [...projectsData.web, ...projectsData.ai, ...projectsData.mobile]
      : projectsData[type] || [];
    items.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.title}" style="width:100%;height:140px;object-fit:cover;border-radius:8px;margin-bottom:12px" />
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <a class="view" href="#" aria-label="View ${p.title}">View</a>
      `;
      projectsGrid.appendChild(card);
      // small reveal
      requestAnimationFrame(() => card.classList.remove('hide'));
    });
  }

  // init
  renderProjects('all');

  typeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const t = btn.dataset.type;
      // fade out current grid quickly then render new
      const children = Array.from(projectsGrid.children);
      children.forEach(c => c.classList.add('hide'));
      setTimeout(() => renderProjects(t), 220);
    });
  });

  /* SKILL BARS animate when visible */
  const skillFills = document.querySelectorAll('.skill-fill');
  function animateSkills() {
    const el = document.getElementById('skills');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      skillFills.forEach(s => {
        const w = s.getAttribute('data-fill') || '60%';
        s.style.width = w;
      });
      // remove listener after run once
      window.removeEventListener('scroll', animateSkills);
    }
  }
  window.addEventListener('scroll', animateSkills);
  animateSkills();

  /* NAV active on scroll + smooth scroll for nav links */
  const navLinks = document.querySelectorAll('nav a');
  const sections = Array.from(document.querySelectorAll('section'));

  function highlightNav() {
    let currentId = sections[0].id;
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= window.innerHeight * 0.35) currentId = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', highlightNav);
  highlightNav();

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

});
