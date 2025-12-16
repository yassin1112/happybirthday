// Happy Birthday Song Notes (in Hz)
const birthdayNotes = [
    { note: 'C4', duration: 200 },  // Happy
    { note: 'C4', duration: 200 },
    { note: 'D4', duration: 400 },  // birth-
    { note: 'C4', duration: 400 },  // day
    { note: 'F4', duration: 400 },  // to
    { note: 'E4', duration: 800 },  // you
    
    { note: 'C4', duration: 200 },  // Happy
    { note: 'C4', duration: 200 },
    { note: 'D4', duration: 400 },  // birth-
    { note: 'C4', duration: 400 },  // day
    { note: 'G4', duration: 400 },  // to
    { note: 'F4', duration: 800 },  // you
    
    { note: 'C4', duration: 200 },  // Happy
    { note: 'C4', duration: 200 },
    { note: 'C5', duration: 400 },  // birth-
    { note: 'A4', duration: 400 },  // day
    { note: 'F4', duration: 400 },  // dear
    { note: 'E4', duration: 400 },  // [name]
    { note: 'D4', duration: 400 },  // Happy
    { note: 'Bb4', duration: 400 }, // birth-
    { note: 'Bb4', duration: 400 }, // day
    { note: 'A4', duration: 400 },  // to
    { note: 'F4', duration: 400 },  // you
    { note: 'G4', duration: 400 }, // !
    { note: 'F4', duration: 800 },  // !
];

// Musical note frequencies
const noteFrequencies = {
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392.00,
    'A4': 440.00,
    'Bb4': 466.16,
    'C5': 523.25,
};

let audioContext;
let isPlaying = false;

// Initialize Audio Context
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Play a single note
function playNote(frequency, duration) {
    return new Promise((resolve) => {
        const audioContext = initAudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        // Envelope for smoother sound
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);
        
        oscillator.start(now);
        oscillator.stop(now + duration / 1000);
        
        oscillator.onended = () => resolve();
    });
}

// Play the complete birthday song
async function playBirthdaySong() {
    if (isPlaying) {
        return;
    }
    
    isPlaying = true;
    const button = document.querySelector('.play-button');
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="play-icon">🎵</span> جاري التشغيل...';
    button.disabled = true;
    
    try {
        // Resume audio context if suspended (required by some browsers)
        const audioContext = initAudioContext();
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        
        // Play each note in sequence
        for (const { note, duration } of birthdayNotes) {
            const frequency = noteFrequencies[note];
            if (frequency) {
                await playNote(frequency, duration);
            }
        }
        
        // Add confetti burst effect
        createConfettiBurst();
        
    } catch (error) {
        console.error('Error playing song:', error);
        alert('حدث خطأ في تشغيل اللحن. يرجى المحاولة مرة أخرى.');
    } finally {
        isPlaying = false;
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// Create confetti burst effect
function createConfettiBurst() {
    const container = document.querySelector('.container');
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da', '#fcbad3', '#ffd93d'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = '50%';
        confetti.style.top = '50%';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 200 + Math.random() * 100;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity;
        
        confetti.style.transform = `translate(-50%, -50%)`;
        confetti.style.transition = 'all 2s ease-out';
        
        container.appendChild(confetti);
        
        setTimeout(() => {
            confetti.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            confetti.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            confetti.remove();
        }, 2000);
    }
}

// Add click event to play button on page load
document.addEventListener('DOMContentLoaded', () => {
    // Auto-play option (commented out - uncomment if you want auto-play)
    // setTimeout(() => playBirthdaySong(), 1000);
    
    // Add sparkle effect to stars on hover
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            star.style.transform = 'scale(1.5) rotate(360deg)';
            star.style.transition = 'transform 0.5s ease';
        });
        star.addEventListener('mouseleave', () => {
            star.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// Add extra animation when page loads
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease-in';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

