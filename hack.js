
document.addEventListener('DOMContentLoaded', () => {
  // Journal functional
  const journalTextarea = document.getElementById('journalEntry');
  const saveJournalBtn = document.getElementById('saveJournal');
  const journalStatus = document.getElementById('journalStatus');

  // Load saved entry on page
  const savedEntry = localStorage.getItem('journalEntry');
  if (savedEntry) {
    journalTextarea.value = savedEntry;
  }

  // Journal save function
  saveJournalBtn.addEventListener('click', () => {
    // Save to localStorage
    localStorage.setItem('journalEntry', journalTextarea.value);
    // Show animated message
    journalStatus.style.display = 'block';
    journalStatus.classList.add('animated');
    setTimeout(() => {
      journalStatus.style.display = 'none';
      journalStatus.classList.remove('animated');
    }, 1500);
  });

  // Clinic search function
  const clinicSearch = document.getElementById('clinicSearch');
  const clinicList = document.getElementById('clinicList');
  if (clinicSearch && clinicList) {
    clinicSearch.addEventListener('input', function() {
      const filter = this.value.toLowerCase();
      Array.from(clinicList.children).forEach(li => {
        if (!filter) {
          li.style.display = 'none';
          return;
        }
        const borough = li.getAttribute('data-borough').toLowerCase();
        const neighborhood = li.getAttribute('data-neighborhood').toLowerCase();
        if (borough.includes(filter) || neighborhood.includes(filter) || li.textContent.toLowerCase().includes(filter)) {
          li.style.display = '';
        } else {
          li.style.display = 'none';
        }
      });
    });
  }

  // Awareness Quiz function
  const quizForm = document.getElementById('awarenessQuiz');
  const quizResult = document.getElementById('quizResult');
  if (quizForm) {
    quizForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let score = 0;
      // Q1: False is correct
      if (quizForm.q1.value === 'false') score++;
      // Q2: Exercise, healthy eating, talking to friends (not 'none')
      const q2 = Array.from(quizForm.querySelectorAll('input[name="q2"]:checked')).map(cb => cb.value);
      if (
        q2.includes('exercise') &&
        q2.includes('healthy eating') &&
        q2.includes('talking to friends') &&
        !q2.includes('none')
      ) score++;
      // Q3: All except 'no one'
      const q3 = Array.from(quizForm.querySelectorAll('input[name="q3"]:checked')).map(cb => cb.value);
      if (
        q3.includes('trusted adult') &&
        q3.includes('friend') &&
        q3.includes('mental health professional') &&
        !q3.includes('no one')
      ) score++;
      // Show result
      quizResult.innerHTML = `<strong>Your score: ${score}/3</strong><br>
        ${score === 3 ? "Great job! You're very aware!" : "Keep learning and taking care of your mental health!"}`;
    });
  }

  // "Scroll to top" Button
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      scrollTopBtn.style.display = 'block';
    } else {
      scrollTopBtn.style.display = 'none';
    }
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const shareBtn = document.getElementById('shareBtn');
  const shareStatus = document.getElementById('shareStatus');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: document.title,
        text: "Check out this Youth Mental Health Hub!",
        url: window.location.href
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          //  error
        }
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        shareStatus.style.display = 'inline';
        setTimeout(() => {
          shareStatus.style.display = 'none';
        }, 1500);
      } else {
        // for very old browsers (just in case)
        prompt("Copy this link:", window.location.href);
      }
    });
  }
  // Mood check-in logic
  const buttons = document.querySelectorAll('.emoji-btn');
  const moodResponse = document.getElementById('moodResponse');
  const moodCounter = document.getElementById('moodCounter');

  // Load saved count
  let moodCount = parseInt(localStorage.getItem('moodCount')) || 0;
  moodCounter.textContent = moodCount;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.textContent;
      let message = "";

      if (mood === "😊") {
        message = "Yay! Glad to hear it 😊";
      } else if (mood === "😐") {
        message = "Thanks for sharing. Remember, it's okay to have neutral days.";
      } else if (mood === "😢") {
        message = "Sorry you're feeling down. If you need support, we're here for you 💙";
      } else if (mood === "😠") {
        message = "It's okay to feel angry sometimes. Take a deep breath and take care of yourself.";
      } else {
        message = `Thanks for checking in. You selected: ${mood}`;
      }

      moodResponse.textContent = message;

      // Update count
      moodCount++;
      localStorage.setItem('moodCount', moodCount);
      moodCounter.textContent = moodCount;

      // Optional: show badge
      const badge = document.getElementById('badgeCard');
      if (badge && moodCount === 5) {
        badge.style.display = 'block';
      }
    });
  });
});
