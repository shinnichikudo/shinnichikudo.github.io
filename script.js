// --- 1. DANH SÁCH LỜI CHÚC ---
const blessings = [
    "Tiền vào như nước", "Làm ăn phát đạt", "Phú quý dư dả",
    "Thuận buồm xuôi gió", "Vạn sự như ý", "Quan hệ rộng mở",
    "Thư thái", "Dịu dàng kiên định", "Tình duyên êm đẹp",
    "Nụ cười luôn nở", "Giàu sang phú quý", "Không chút phiền lo",
    "Vô lo vô nghĩ", "Ung dung tự tại", "Bứt phá giới hạn",
    "Làm chủ cảm xúc", "Tỉnh táo hiểu mình", "Tâm hồn rộng mở",
    "Thăng tiến", "Lạc quan", "Chân thành",
    "Bình an", "Thân tâm an lạc", "Dũng cảm",
    "Chữa lành mạnh mẽ", "Thông tuệ", "Tài vận hưng thịnh",
    "Lột xác thành công", "Tràn đầy hy vọng", "Sống đời bình yên",
    "Kiên cường", "Điềm tĩnh tỉnh táo", "Mọi việc hanh thông",
    "Tâm không tạp niệm", "Nhẹ nhàng", "Tài lộc tứ phương",
    "Cuộc sống nề nếp", "Ôn nhu vững chãi", "Sinh tài hữu đạo",
    "May mắn song hành", "Nội tâm vững vàng", "Điềm tĩnh",
    "Biết đủ là vui", "Chiến thắng", "Sức khỏe dồi dào",
    "Lý trí", "Tự chữa lành", "Là chính mình",
    "Tự do tự tại", "Hạnh phúc", "Vạn sự tốt lành",
    "Biết chừng mực", "Sáng suốt", "Kỷ luật",
    "Cảm xúc ổn định", "Tài khí dồi dào", "Ăn ngủ điều độ",
    "Không hối tiếc", "Kiên nhẫn", "Tự do",
    "Nội tâm phong phú", "Ngủ ngon giấc", "Vững chãi",
    "Phân biệt đúng sai", "Giữ lửa đam mê", "Thẳng thắn",
    "Vui vẻ không lo", "Luôn hoan hỉ", "Sung túc đủ đầy"
];

// --- 2. KHAI BÁO CÁC DOM ELEMENT ---
const startButton = document.getElementById('startButton');
const startPage = document.getElementById('startPage');
const blessingPage = document.getElementById('blessingPage');

// --- CẤU HÌNH NHẠC (JS THUẦN) ---
// Tự tạo object Audio, không cần thẻ HTML
// Thêm ./ để khẳng định file nằm ngay tại thư mục gốc
const audio = new Audio('./bgm.mp3');
audio.loop = true;   // Lặp lại vô tận
audio.volume = 1.0;  // Âm lượng to nhất

// --- 3. XỬ LÝ SỰ KIỆN CLICK NÚT ---
startButton.addEventListener('click', () => {
    
    // === DEBUG & PLAY MUSIC ===
    console.log("Đang thử phát nhạc...");
    audio.play()
        .then(() => {
            console.log("--> Phát nhạc THÀNH CÔNG!");
        })
        .catch((error) => {
            console.error("--> LỖI PHÁT NHẠC:", error);
            // Mẹo cho sinh viên: Nếu lỗi này hiện ra, thường là do sai tên file 
            // hoặc trình duyệt chặn Autoplay (nhưng đã click thì ít khi bị chặn)
        });

    // Hiệu ứng chuyển cảnh
    startPage.style.opacity = '0';
    
    setTimeout(() => {
        startPage.style.display = 'none';
        blessingPage.classList.add('active');
        
        setTimeout(() => {
            initBlessingPage();
        }, 500);
    }, 500);
});

// --- 4. CẤU HÌNH PHÁO HOA & TEXT (GIỮ NGUYÊN) ---

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 2 + 1;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.gravity = 0.1;
        this.opacity = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.opacity -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

function createFirework(x, y) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6bcf7f', '#c792ea', '#ff8b94'];
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color));
    }
}

function animate() {
    if (particles.length > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    particles.forEach((particle, index) => {
        if (particle.opacity <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
            particle.draw(ctx);
        }
    });
    
    requestAnimationFrame(animate);
}

let blessingIndex = 0;
const container = document.getElementById('blessingContainer');
const displayedPositions = [];

function getRandomPosition() {
    const maxAttempts = 100;
    const isMobile = window.innerWidth <= 768;
    const minDistance = isMobile ? 8 : 6; 
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const x = Math.random() * 90 + 5;
        const y = Math.random() * 90 + 5;
        
        const centerMarginX = isMobile ? 25 : 20;
        const centerMarginY = isMobile ? 15 : 12;
        const isInCenterX = x > (50 - centerMarginX) && x < (50 + centerMarginX);
        const isInCenterY = y > (50 - centerMarginY) && y < (50 + centerMarginY);
        
        if (isInCenterX && isInCenterY) {
            continue; 
        }
        
        let tooClose = false;
        for (const pos of displayedPositions) {
            const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
            if (distance < minDistance) {
                tooClose = true;
                break;
            }
        }
        
        if (!tooClose) {
            displayedPositions.push({ x, y });
            return { x, y };
        }
    }
    return null;
}

function showBlessing() {
    if (blessingIndex < blessings.length) {
        const pos = getRandomPosition();
        
        if (!pos) {
            blessingIndex++;
            const delay = blessingIndex < 10 ? 500 : blessingIndex < 30 ? 300 : 150;
            setTimeout(showBlessing, delay);
            return;
        }
        
        const blessing = document.createElement('div');
        blessing.className = 'blessing';
        blessing.textContent = blessings[blessingIndex];
        
        blessing.style.left = pos.x + '%';
        blessing.style.top = pos.y + '%';
        
        container.appendChild(blessing);
        blessingIndex++;
        
        const delay = blessingIndex < 10 ? 500 : blessingIndex < 30 ? 300 : 150;
        
        setTimeout(showBlessing, delay);
    } else {
        setTimeout(startFireworks, 500);
    }
}

function startFireworks() {
    animate();
    setInterval(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.6) + canvas.height * 0.2;
        createFirework(x, y);
    }, 800);
}

function initBlessingPage() {
    setTimeout(showBlessing, 500);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
