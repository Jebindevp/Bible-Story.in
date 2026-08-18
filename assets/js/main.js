/**
 * THE HOLY BIBLE DESIGN MODEL - MASTER SCRIPT
 * Handles cinematic video intro, open bible reader pagination, bilingual switching & interactive features
 */

(function () {
  "use strict";

  /* --------------------------------------------------------------------------
     1. SCROLLED HEADER EFFECT
     -------------------------------------------------------------------------- */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (!selectHeader) return;
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 50
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /* --------------------------------------------------------------------------
     2. MOBILE NAVIGATION TOGGLE
     -------------------------------------------------------------------------- */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToggle() {
    const body = document.querySelector("body");
    const navmenu = document.querySelector("#navmenu");
    body.classList.toggle("mobile-nav-active");
    if (navmenu) navmenu.classList.toggle("active");
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.toggle("bi-list");
      mobileNavToggleBtn.classList.toggle("bi-x");
    }
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToggle);
  }

  // Hide mobile nav on clicking menu links
  document.querySelectorAll("#navmenu a").forEach((navmenuLink) => {
    navmenuLink.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToggle();
      }
    });
  });

  // Close mobile nav when clicking outside header
  document.addEventListener("click", (e) => {
    if (document.querySelector(".mobile-nav-active")) {
      const header = document.querySelector("#header");
      if (header && !header.contains(e.target)) {
        mobileNavToggle();
      }
    }
  });

  /* --------------------------------------------------------------------------
     3. PRELOADER
     -------------------------------------------------------------------------- */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.style.opacity = "0";
        setTimeout(() => preloader.remove(), 400);
      }, 300);
    });
  }

  /* --------------------------------------------------------------------------
     4. SCROLL TO TOP BUTTON
     -------------------------------------------------------------------------- */
  const scrollTop = document.querySelector(".scroll-top");
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 200
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /* --------------------------------------------------------------------------
     5. AOS (ANIMATION ON SCROLL) INIT
     -------------------------------------------------------------------------- */
  function aosInit() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 700,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    }
  }
  window.addEventListener("load", aosInit);

  /* --------------------------------------------------------------------------
     6. SWIPER SLIDERS INIT
     -------------------------------------------------------------------------- */
  function initSwiper() {
    if (typeof Swiper === "undefined") return;
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      const configEl = swiperElement.querySelector(".swiper-config");
      if (configEl) {
        let config = JSON.parse(configEl.innerHTML.trim());
        new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);

  /* --------------------------------------------------------------------------
     7. DEDICATED CINEMATIC BIBLE VIDEO INTRO THEATER CONTROLLER
     -------------------------------------------------------------------------- */
  function initBibleVideoIntro() {
    const introOverlay = document.getElementById("bible-intro-overlay");
    const introStage = document.getElementById("introVideoStage");
    const introVideo = document.getElementById("introVideoPlayer");
    const btnEnter = document.getElementById("btnEnterBible");
    const btnSkipTop = document.getElementById("btnSkipIntroTop");
    const btnSound = document.getElementById("btnToggleSound");
    const soundIcon = document.getElementById("soundIcon");
    const soundText = document.getElementById("soundText");
    const btnReplayNav = document.getElementById("btnReplayIntro");
    const btnRestart = document.getElementById("btnRestartIntro");
    const btnPlayPause = document.getElementById("btnPlayPauseOverlay");
    const playPauseIcon = document.getElementById("playPauseIcon");
    const progressFill = document.getElementById("introProgressFill");

    if (!introOverlay) return;

    // Check if user already viewed intro in this session
    const hasSeenIntro = sessionStorage.getItem("bible_intro_seen");

    function updatePlayState(isPlaying) {
      if (introStage) {
        introStage.classList.toggle("is-playing", isPlaying);
      }
      if (playPauseIcon) {
        playPauseIcon.className = isPlaying ? "bi bi-pause-fill" : "bi bi-play-fill";
      }
    }

    function openIntro() {
      introOverlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      if (introVideo) {
        introVideo.currentTime = 0;
        introVideo.play().then(() => {
          updatePlayState(true);
        }).catch(() => {
          // If autoplay blocked, show play button
          updatePlayState(false);
        });
      }
    }

    function closeIntro() {
      introOverlay.classList.add("hidden");
      document.body.style.overflow = "";
      sessionStorage.setItem("bible_intro_seen", "true");
      if (introVideo) {
        introVideo.pause();
        updatePlayState(false);
      }
    }

    // Video progress update
    if (introVideo) {
      introVideo.addEventListener("timeupdate", () => {
        if (progressFill && introVideo.duration) {
          const progress = (introVideo.currentTime / introVideo.duration) * 100;
          progressFill.style.width = `${progress}%`;
        }
      });

      introVideo.addEventListener("play", () => updatePlayState(true));
      introVideo.addEventListener("pause", () => updatePlayState(false));
      introVideo.addEventListener("ended", () => {
        updatePlayState(false);
      });
    }

    // Toggle Play / Pause on Video Stage Click
    if (btnPlayPause && introVideo) {
      btnPlayPause.addEventListener("click", () => {
        if (introVideo.paused) {
          introVideo.play();
        } else {
          introVideo.pause();
        }
      });
    }

    if (introStage && introVideo) {
      introStage.addEventListener("click", (e) => {
        if (e.target === btnPlayPause || btnPlayPause.contains(e.target)) return;
        if (introVideo.paused) {
          introVideo.play();
        } else {
          introVideo.pause();
        }
      });
    }

    // Initial state check
    if (hasSeenIntro === "true") {
      introOverlay.classList.add("hidden");
    } else {
      openIntro();
    }

    // Next: Enter Holy Scriptures & Skip actions
    if (btnEnter) {
      btnEnter.addEventListener("click", closeIntro);
    }
    if (btnSkipTop) {
      btnSkipTop.addEventListener("click", closeIntro);
    }

    // Sound toggle
    if (btnSound && introVideo) {
      btnSound.addEventListener("click", () => {
        introVideo.muted = !introVideo.muted;
        if (soundIcon) {
          soundIcon.className = introVideo.muted
            ? "bi bi-volume-mute-fill"
            : "bi bi-volume-up-fill";
        }
        if (soundText) {
          soundText.textContent = introVideo.muted ? "Unmute" : "Mute";
        }
      });
    }

    // Replay / Restart actions
    if (btnRestart && introVideo) {
      btnRestart.addEventListener("click", () => {
        introVideo.currentTime = 0;
        introVideo.play();
        updatePlayState(true);
      });
    }

    if (btnReplayNav) {
      btnReplayNav.addEventListener("click", (e) => {
        e.preventDefault();
        openIntro();
      });
    }
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initBibleVideoIntro);
  } else {
    initBibleVideoIntro();
  }

  /* --------------------------------------------------------------------------
     8. OPEN BIBLE BOOK READER CARD CONTROLLER (Left Content / Right Image)
     -------------------------------------------------------------------------- */
  function initBibleReaderCards() {
    const cards = document.querySelectorAll(".related-card");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const pageInfo = document.getElementById("page-info");
    const cardsContainer = document.querySelector(".related-cards") || document.querySelector(".related-posts");
    if (!cards || cards.length === 0) return;

    let currentCard = 0;

    function showCard(index, shouldScroll = false) {
      cards.forEach((card, i) => {
        const isActive = (i === index);
        card.classList.toggle("active", isActive);
        if (isActive) {
          const content = card.querySelector(".card-content");
          if (content) content.scrollTop = 0;
        }
      });
      if (pageInfo) {
        pageInfo.textContent = `Page ${index + 1} of ${cards.length}`;
      }
      if (shouldScroll && window.innerWidth <= 991 && cardsContainer) {
        cardsContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentCard = (currentCard + 1) % cards.length;
        showCard(currentCard, true);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentCard = (currentCard - 1 + cards.length) % cards.length;
        showCard(currentCard, true);
      });
    }

    // Keyboard Arrow Navigation (Left / Right Arrow)
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight" && nextBtn) {
        currentCard = (currentCard + 1) % cards.length;
        showCard(currentCard);
      } else if (e.key === "ArrowLeft" && prevBtn) {
        currentCard = (currentCard - 1 + cards.length) % cards.length;
        showCard(currentCard);
      }
    });

    // Touch Swipe Gesture Support for Mobile Devices & Tablets
    if (cardsContainer) {
      let touchStartX = 0;
      let touchEndX = 0;
      let touchStartY = 0;
      let touchEndY = 0;
      const minSwipeDistance = 45;

      cardsContainer.addEventListener(
        "touchstart",
        (e) => {
          touchStartX = e.changedTouches[0].screenX;
          touchStartY = e.changedTouches[0].screenY;
        },
        { passive: true }
      );

      cardsContainer.addEventListener(
        "touchend",
        (e) => {
          touchEndX = e.changedTouches[0].screenX;
          touchEndY = e.changedTouches[0].screenY;
          const diffX = touchStartX - touchEndX;
          const diffY = touchStartY - touchEndY;

          // Only trigger if horizontal swipe is greater than vertical swipe
          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
              // Swipe left -> Next card
              currentCard = (currentCard + 1) % cards.length;
              showCard(currentCard, true);
            } else {
              // Swipe right -> Prev card
              currentCard = (currentCard - 1 + cards.length) % cards.length;
              showCard(currentCard, true);
            }
          }
        },
        { passive: true }
      );
    }

    // Initialize first card
    showCard(currentCard);
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initBibleReaderCards);
  } else {
    initBibleReaderCards();
  }

  /* --------------------------------------------------------------------------
     9. BILINGUAL LANGUAGE CONTROLLER (English / Tamil)
     -------------------------------------------------------------------------- */
  function initLanguageToggle() {
    const tamilBtn = document.getElementById("tamil-btn");
    const englishBtn = document.getElementById("english-btn");

    if (tamilBtn) {
      tamilBtn.addEventListener("click", () => {
        tamilBtn.classList.add("active");
        if (englishBtn) englishBtn.classList.remove("active");
        document.querySelectorAll(".ta").forEach((el) => (el.style.display = "block"));
        document.querySelectorAll(".en").forEach((el) => (el.style.display = "none"));
      });
    }

    if (englishBtn) {
      englishBtn.addEventListener("click", () => {
        englishBtn.classList.add("active");
        if (tamilBtn) tamilBtn.classList.remove("active");
        document.querySelectorAll(".en").forEach((el) => (el.style.display = "block"));
        document.querySelectorAll(".ta").forEach((el) => (el.style.display = "none"));
      });
    }
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initLanguageToggle);
  } else {
    initLanguageToggle();
  }

  /* --------------------------------------------------------------------------
     10. EMBEDDED BIBLE VIDEO PLAYER CONTROLLER
     -------------------------------------------------------------------------- */
  function initEmbeddedVideo() {
    const playBtn = document.getElementById("playBtn");
    const bibleVideo = document.getElementById("bibleVideo");

    if (playBtn && bibleVideo) {
      playBtn.addEventListener("click", () => {
        if (bibleVideo.paused) {
          bibleVideo.play();
          playBtn.style.opacity = "0.2";
          const icon = playBtn.querySelector("i");
          if (icon) icon.className = "bi bi-pause-fill";
        } else {
          bibleVideo.pause();
          playBtn.style.opacity = "1";
          const icon = playBtn.querySelector("i");
          if (icon) icon.className = "bi bi-play-fill";
        }
      });

      bibleVideo.addEventListener("mouseenter", () => {
        playBtn.style.opacity = "1";
      });

      bibleVideo.addEventListener("mouseleave", () => {
        if (!bibleVideo.paused) {
          playBtn.style.opacity = "0.2";
        }
      });
    }
  }
  window.addEventListener("DOMContentLoaded", initEmbeddedVideo);
})();