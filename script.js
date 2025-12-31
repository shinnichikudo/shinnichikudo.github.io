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

// --- 2. KHAI BÁO DOM ---
const startButton = document.getElementById('startButton');
const startPage = document.getElementById('startPage');
const blessingPage = document.getElementById('blessingPage');

// --- CẤU HÌNH NHẠC ---
const audio = new Audio('./bgm.mp3'); 
audio.loop = true;
audio.volume = 1.0;

// --- 3. XỬ LÝ CLICK ---
startButton.addEventListener('click', () => {
    console.log("Đang thử phát nhạc...");
    audio.play().catch((e) => console.error("Lỗi nhạc:", e));

    startPage.style.opacity = '0';
    
    setTimeout(() => {
        startPage.style.display = 'none';
        blessingPage.classList.add('active');
        setTimeout(initBlessingPage, 500);
    }, 500);
});

// --- 4. LOGIC CHỮ CHÚC MỪNG ---
let blessingIndex = 0;
const container = document.getElementById('blessingContainer');
const displayedPositions = [];

function getRandomPosition() {
    // Tăng số lần thử lên cao để cố tìm chỗ trống cuối cùng
    const maxAttempts = 500; 
    const isMobile = window.innerWidth <= 768;
    
    // --- QUAN TRỌNG: KHOẢNG CÁCH ---
    // Để nhét hết 50+ câu vào mobile, khoảng cách phải rất nhỏ (3.0)
    // Chấp nhận chữ có thể đứng sát sàn sạt nhau
    const minDistance = isMobile ? 3.0 : 6; 
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Random rộng ra sát mép màn hình (2% - 98%) để tận dụng diện tích
        const x = Math.random() * 96 + 2; 
        const y = Math.random() * 90 + 5;
        
        // Vùng cấm hình chữ nhật cho câu "Hy vọng..."
        const marginX = isMobile ? 35 : 25; 
        const marginY = isMobile ? 12 : 12;

        const isInForbiddenZone = 
            (x > (50 - marginX) && x < (50 + marginX)) && 
            (y > (50 - marginY) && y < (50 + marginY));
        
        if (isInForbiddenZone) continue;
        
        let tooClose = false;
        for (const pos of displayedPositions) {
            const dx = x - pos.x;
            const dy = (y - pos.y) * (window.innerHeight / window.innerWidth); 
            const distance = Math.sqrt(dx*dx + dy*dy);
            
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
    const isMobile = window.innerWidth <= 768;
    
    // --- YÊU CẦU: HIỆN HẾT FULL DANH SÁCH ---
    const maxItems = blessings.length; 

    if (displayedPositions.length < maxItems && blessingIndex < blessings.length) {
        
        const pos = getRandomPosition();
        
        // Nếu không tìm được chỗ (do màn hình đã kín mít)
        if (!pos) {
            // Vẫn cố thử thêm vài lần nữa
            blessingIndex++; 
            // Nếu đã thử quá nhiều mà ko được thì bỏ qua từ này, sang từ sau
            setTimeout(showBlessing, 10); 
            return;
        }
        
        const blessing = document.createElement('div');
        blessing.className = 'blessing';
        blessing.textContent = blessings[blessingIndex];
        
        blessing.style.left = pos.x + '%';
        blessing.style.top = pos.y + '%';
        
        const textColors = ['#ffffff', '#fffacd', '#e0ffff', '#ffe4e1'];
        blessing.style.color = textColors[Math.floor(Math.random() * textColors.length)];

        container.appendChild(blessing);
        
        // Tăng index tuần tự để không bỏ sót từ nào
        blessingIndex++; 
        
        // --- TỐC ĐỘ HIỂN THỊ (GIỮ NGUYÊN TỐC ĐỘ CHẬM) ---
        let delay;
        if (isMobile) {
            // Mobile: 5 từ đầu siêu chậm, sau đó vừa phải
            delay = displayedPositions.length < 5 ? 800 : 
                    displayedPositions.length < 20 ? 400 : 250;
        } else {
            // PC: Nhanh hơn
            delay = displayedPositions.length < 5 ? 500 : 
                    displayedPositions.length < 20 ? 300 : 150;
        }
        
        setTimeout(showBlessing, delay);
    } else {
        // Hiện hết sạch sành sanh thì bắn pháo hoa
        setTimeout(startFireworks, 500);
    }
}

function initBlessingPage() {
    const startDelay = window.innerWidth <= 768 ? 800 : 500;
    setTimeout(showBlessing, startDelay);
}

// --- 5. LOGIC PHÁO HOA ---
class Particle {
    constructor(x, y, color) {
        this.x = x; this.y = y; this.color = color;
        this.radius = Math.random() * 2 + 1;
        this.velocity = { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 };
        this.gravity = 0.1; this.opacity = 1; this.decay = Math.random() * 0.02 + 0.01;
    }
    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x; this.y += this.velocity.y;
        this.opacity -= this.decay;
    }
    draw(ctx) {
        ctx.save(); ctx.globalAlpha = this.opacity; ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
    }
}

const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];

function createFirework(x, y) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6bcf7f', '#c792ea', '#ff8b94'];
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
    }
}

function animate() {
    if (particles.length > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    particles.forEach((p, i) => {
        if (p.opacity <= 0) particles.splice(i, 1);
        else { p.update(); p.draw(ctx); }
    });
    requestAnimationFrame(animate);
}

function startFireworks() {
    animate();
    setInterval(() => {
        createFirework(
            Math.random() * canvas.width, 
            Math.random() * (canvas.height * 0.6) + canvas.height * 0.2
        );
    }, 800);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
