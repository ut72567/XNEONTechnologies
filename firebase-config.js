import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, query, where, onSnapshot, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// 🔴 CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyCCc2pN-sdmwoz1aXxqX4rnN1-oUU_5s7w",
  authDomain: "xneon-c12a2.firebaseapp.com",
  projectId: "xneon-c12a2",
  storageBucket: "xneon-c12a2.firebasestorage.app",
  messagingSenderId: "167464497598",
  appId: "1:167464497598:web:39d973982f33b6a17d49ef",
  measurementId: "G-KF5164H922"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

auth.useDeviceLanguage(); // Auto-detect language

// Initialize EmailJS (Order receipts ke liye future mein kaam aayega)
(function() {
    if(window.emailjs) emailjs.init("7ps995woJ-0Gp79Nm");
})();

export { db, auth, storage, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, query, where, onSnapshot, orderBy, serverTimestamp, signOut, onAuthStateChanged, ref, uploadBytes, getDownloadURL };

export const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

window.toggleSearch = () => {
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    if (overlay.classList.contains('hidden')) { overlay.classList.remove('hidden'); setTimeout(() => input.focus(), 100); } 
    else { overlay.classList.add('hidden'); input.value = ""; }
};

// --- NAVBAR LOGIC (PHONE AUTH + OPTIONAL EMAIL) ---
export function loadNavbar() {
    const nav = document.getElementById('navbar');
    if(!nav) return;

    nav.innerHTML = `
        <nav class="w-full bg-black/95 backdrop-blur-md fixed top-0 z-50 border-b border-gray-800 shadow-md h-[70px] flex items-center">
            <div id="nav-main" class="w-full max-w-screen-xl mx-auto px-2 flex items-center justify-between h-full">
                <a href="index.html" class="flex-shrink-0 w-[110px] md:w-[150px] h-full flex items-center overflow-hidden">
                    <img id="nav-logo" src="https://via.placeholder.com/150x50?text=XNEON" class="h-8 md:h-12 w-full object-contain object-left" alt="XNEON">
                </a>
                <div class="flex-1"></div>
                <div class="flex items-center gap-1 md:gap-4 flex-shrink-0">
                    <button onclick="window.toggleSearch()" class="text-white p-2 rounded-full hover:bg-gray-800"><svg class="w-[28px] h-[28px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>
                    <a href="cart.html" class="relative text-white p-2 rounded hover:bg-gray-800"><svg class="w-[28px] h-[28px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg><span id="cart-count" class="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full hidden">0</span></a>
                    <button id="menu-toggle" class="text-white p-2 rounded hover:bg-gray-800"><svg class="w-[34px] h-[34px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button>
                </div>
            </div>

            <div id="search-overlay" class="hidden fixed top-0 left-0 w-full h-[70px] bg-black z-[100] flex items-center px-4 border-b border-gray-800 shadow-2xl">
                <div class="w-full max-w-screen-xl mx-auto flex items-center gap-3">
                    <div class="flex-1 relative"><input type="text" id="search-input" class="block w-full py-2 pl-3 pr-3 text-white bg-[#1a1a1a] border border-gray-700 rounded-lg focus:border-red-600 focus:outline-none placeholder-gray-500 text-base" placeholder="Search..."></div>
                    <button onclick="window.toggleSearch()" class="text-gray-400 font-bold px-3 py-2 text-sm uppercase">Cancel</button>
                </div>
            </div>

            <div id="mobile-menu" class="hidden bg-[#111] border-b border-gray-800 absolute w-full left-0 top-[70px] shadow-xl z-40 h-screen"><ul class="flex flex-col font-medium text-lg" id="menu-list"></ul></div>
        </nav>
        <div class="h-[70px]"></div>

        <div id="auth-modal" class="fixed inset-0 bg-black/90 z-[60] hidden flex items-center justify-center p-4">
            <div class="bg-[#111] border border-gray-800 rounded-xl p-6 w-full max-w-sm relative shadow-2xl">
                <button onclick="document.getElementById('auth-modal').classList.add('hidden');" class="absolute top-2 right-4 text-gray-500 text-2xl hover:text-white">&times;</button>
                <h2 class="text-xl font-bold mb-4 text-white text-center" id="auth-title">Login / Signup</h2>
                
                <div id="auth-step-1">
                    <div class="flex gap-2 mb-3">
                        <span class="bg-gray-800 text-white p-3 rounded border border-gray-700 font-bold">+91</span>
                        <input type="number" id="phone-number" placeholder="Mobile Number" class="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-green-500 outline-none font-bold tracking-wider">
                    </div>
                    
                    <input type="email" id="optional-email" placeholder="Email Address (Optional)" class="w-full bg-black border border-gray-700 text-white p-3 rounded mb-4 focus:border-blue-500 outline-none text-sm">
                    
                    <div id="recaptcha-container" class="mb-4 flex justify-center"></div>
                    <button id="btn-get-otp" class="w-full bg-white text-black font-bold py-3 rounded hover:bg-gray-200 transition">GET OTP ON SMS</button>
                </div>

                <div id="auth-step-2" class="hidden text-center">
                    <p class="text-gray-400 text-sm mb-4">OTP sent via SMS to <span id="otp-sent-number" class="text-white font-bold"></span></p>
                    <input type="number" id="otp-input" placeholder="XXXXXX" class="w-full bg-black border border-gray-700 text-white p-3 rounded mb-4 text-center text-xl tracking-[10px] font-bold focus:border-green-500 outline-none">
                    <button id="btn-verify-otp" class="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700">VERIFY & LOGIN</button>
                    <button onclick="resetAuthUI()" class="mt-4 text-xs text-gray-500 underline">Change Number</button>
                </div>
                
                <p id="auth-msg" class="text-center text-xs mt-3 text-yellow-500 animate-pulse hidden">Processing...</p>
            </div>
        </div>
    `;

    // Logo Logic
    getDoc(doc(db, "settings", "general")).then(snap => { if(snap.exists() && snap.data().logo) document.getElementById('nav-logo').src = snap.data().logo; });

    // --- PHONE AUTH LOGIC ---
    window.recaptchaVerifier = null;
    window.confirmationResult = null;
    let tempUserEmail = ""; // To store optional email

    window.resetAuthUI = () => {
        document.getElementById('auth-step-1').classList.remove('hidden');
        document.getElementById('auth-step-2').classList.add('hidden');
        document.getElementById('auth-title').innerText = "Login / Signup";
        document.getElementById('otp-input').value = "";
        document.getElementById('auth-msg').classList.add('hidden');
    };

    setTimeout(() => {
        if(!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'normal',
                'callback': (response) => { /* Captcha Solved */ },
                'expired-callback': () => { /* Expired */ }
            });
            window.recaptchaVerifier.render();
        }

        const btnGetOtp = document.getElementById('btn-get-otp');
        const btnVerifyOtp = document.getElementById('btn-verify-otp');
        const authMsg = document.getElementById('auth-msg');

        // 1. Send OTP (SMS)
        if(btnGetOtp) btnGetOtp.addEventListener('click', () => {
            const phoneVal = document.getElementById('phone-number').value;
            tempUserEmail = document.getElementById('optional-email').value.trim(); // Capture Email

            if(phoneVal.length !== 10) { alert("Please enter valid 10-digit number"); return; }
            
            const phoneNumber = "+91" + phoneVal;
            authMsg.innerText = "Sending SMS OTP..."; authMsg.classList.remove('hidden');
            
            signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
                .then((confirmationResult) => {
                    window.confirmationResult = confirmationResult;
                    document.getElementById('auth-step-1').classList.add('hidden');
                    document.getElementById('auth-step-2').classList.remove('hidden');
                    document.getElementById('otp-sent-number').innerText = phoneNumber;
                    authMsg.classList.add('hidden');
                }).catch((error) => {
                    authMsg.innerText = "Error: " + error.message;
                    console.error(error);
                    if(window.recaptchaVerifier) window.recaptchaVerifier.clear();
                });
        });

        // 2. Verify OTP & Save Email (if provided)
        if(btnVerifyOtp) btnVerifyOtp.addEventListener('click', () => {
            const code = document.getElementById('otp-input').value;
            if(code.length < 6) return;

            authMsg.innerText = "Verifying..."; authMsg.classList.remove('hidden');

            window.confirmationResult.confirm(code).then(async (result) => {
                const user = result.user;
                const userRef = doc(db, "users", user.uid);
                
                // Prepare Data
                let userData = { 
                    phone: user.phoneNumber, 
                    role: "customer",
                    lastLogin: serverTimestamp()
                };

                // Agar Email dala tha, toh use bhi save karo
                if(tempUserEmail && tempUserEmail.length > 5) {
                    userData.email = tempUserEmail;
                }

                // Check and Update Database
                const userSnap = await getDoc(userRef);
                if(!userSnap.exists()) {
                    // New User: Create Profile with Phone + Optional Email
                    userData.createdAt = serverTimestamp();
                    await setDoc(userRef, userData);
                } else {
                    // Old User: Update Email if provided
                    if(tempUserEmail) {
                        await updateDoc(userRef, { email: tempUserEmail, lastLogin: serverTimestamp() });
                    }
                }
                
                alert("✅ Login Successful!");
                window.location.reload();
            }).catch((error) => {
                authMsg.innerText = "Wrong OTP";
                alert("Invalid OTP");
            });
        });

    }, 1000);

    // Menu Logic
    const menuList = document.getElementById('menu-list');
    const commonLinks = `
        <li><a href="index.html" class="block py-4 px-6 text-white hover:bg-gray-800 border-b border-gray-800 flex items-center gap-4"><span>Home</span></a></li>
        <li><a href="categories.html" class="block py-4 px-6 text-white hover:bg-gray-800 border-b border-gray-800 flex items-center gap-4"><span>Categories</span></a></li>
    `;

    onAuthStateChanged(auth, (user) => {
        if(user) {
            menuList.innerHTML = `${commonLinks}<li><a href="orders.html" class="block py-4 px-6 text-white hover:bg-gray-800 border-b border-gray-800 flex items-center gap-4"><span>My Orders</span></a></li><li><button id="logout-btn" class="w-full text-left py-4 px-6 text-red-500 hover:bg-gray-800 border-b border-gray-800 flex items-center gap-4"><span>Logout (${user.phoneNumber})</span></button></li>`;
            setTimeout(() => document.getElementById('logout-btn')?.addEventListener('click', () => signOut(auth).then(() => window.location.reload())), 500);
        } else {
            menuList.innerHTML = `${commonLinks}<li><button onclick="document.getElementById('auth-modal').classList.remove('hidden')" class="w-full text-left py-4 px-6 text-green-500 hover:bg-gray-800 border-b border-gray-800 flex items-center gap-4"><span>Login with Phone</span></button></li>`;
        }
    });

    document.getElementById('menu-toggle')?.addEventListener('click', () => document.getElementById('mobile-menu').classList.toggle('hidden'));
    
    // Cart Count
    onAuthStateChanged(auth, (user) => {
        if (user) onSnapshot(collection(db, "carts", user.uid, "items"), (snap) => {
            const count = document.getElementById('cart-count');
            if(count) { count.innerText = snap.size; count.classList.toggle('hidden', snap.size === 0); }
        });
    });
}