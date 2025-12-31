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

// --- Thay thế hàm getRandomPosition cũ bằng hàm này ---

// --- Thay thế hàm getRandomPosition cũ bằng hàm này ---

// --- Thay thế hàm getRandomPosition cũ bằng hàm này ---

function getRandomPosition() {
    const maxAttempts = 150; // Tăng số lần thử tìm chỗ trống
    const isMobile = window.innerWidth <= 768;
    
    // Mobile cần khoảng cách thưa hơn nữa
    const minDistance = isMobile ? 10 : 6; 
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Random vị trí từ 2% đến 90% (tránh sát mép màn hình quá)
        const x = Math.random() * 88 + 2; 
        const y = Math.random() * 88 + 5;
        
        // === TẠO VÙNG CẤM (SAFE ZONE) ===
        // Hình chữ nhật bao quanh câu "Hy vọng năm 2026..."
        // Mobile: Vùng cấm rộng 80% chiều ngang, cao 30% chiều dọc
        
        // Tính tâm màn hình là 50
        // MarginX = 40 nghĩa là cấm từ (50-40)=10 đến (50+40)=90 theo chiều ngang
        const marginX = isMobile ? 40 : 25; 
        // MarginY = 15 nghĩa là cấm từ (50-15)=35 đến (50+15)=65 theo chiều dọc
        const marginY = isMobile ? 12 : 12;

        const isInForbiddenZone = 
            (x > (50 - marginX) && x < (50 + marginX)) && 
            (y > (50 - marginY) && y < (50 + marginY));
        
        if (isInForbiddenZone) {
            continue; // Nếu rơi vào vùng cấm thì tìm chỗ khác ngay
        }
        
        // Kiểm tra xem có bị chồng lên chữ khác không
        let tooClose = false;
        for (const pos of displayedPositions) {
            const dx = x - pos.x;
            // Chuẩn hóa tỷ lệ màn hình (vì đt dài hơn rộng)
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

// --- Thay thế hàm showBlessing cũ bằng hàm mới này ---

function showBlessing() {
    // CẤU HÌNH SỐ LƯỢNG: 
    // Nếu là điện thoại: chỉ hiện tối đa 18 câu. Máy tính: 50 câu.
    const isMobile = window.innerWidth <= 768;
    const maxItems = isMobile ? 18 : 50; 

    // Kiểm tra: Nếu đã hiện đủ số lượng hoặc hết từ vựng thì dừng lại
    if (displayedPositions.length < maxItems && blessingIndex < blessings.length) {
        
        const pos = getRandomPosition();
        
        if (!pos) {
            // Nếu không tìm được chỗ trống (do màn hình đầy), bỏ qua và thử lại sau
            // Nhưng nếu đã thử quá nhiều lần thì thôi, chuyển sang bắn pháo hoa luôn
            blessingIndex++; 
            setTimeout(showBlessing, 100);
            return;
        }
        
        const blessing = document.createElement('div');
        blessing.className = 'blessing';
        blessing.textContent = blessings[blessingIndex];
        
        blessing.style.left = pos.x + '%';
        blessing.style.top = pos.y + '%';
        
        // Random màu sắc nhẹ nhàng cho chữ (trắng, vàng nhạt, xanh nhạt)
        const textColors = ['#ffffff', '#fffacd', '#e0ffff', '#ffe4e1'];
        blessing.style.color = textColors[Math.floor(Math.random() * textColors.length)];

        container.appendChild(blessing);
        
        // Tăng index ngẫu nhiên để không bị lặp lại thứ tự cũ
        // (Mẹo: nhảy cóc index để lấy từ ngẫu nhiên trong list)
        blessingIndex += Math.floor(Math.random() * 2) + 1; 
        
        // Tốc độ xuất hiện
        setTimeout(showBlessing, 200);
    } else {
        // Đã hiện đủ số lượng cần thiết -> Bắn pháo hoa
        console.log("Đã hiện đủ " + displayedPositions.length + " lời chúc. Bắt đầu pháo hoa!");
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
