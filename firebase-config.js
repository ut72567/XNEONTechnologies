import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, query, where, onSnapshot, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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

// Initialize EmailJS safely
(function() {
    if(window.emailjs) emailjs.init("7ps995woJ-0Gp79Nm");
})();

export { db, auth, storage, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, query, where, onSnapshot, orderBy, serverTimestamp, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, ref, uploadBytes, getDownloadURL };

export const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

window.toggleSearch = () => {
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    if (overlay.classList.contains('hidden')) { overlay.classList.remove('hidden'); setTimeout(() => input.focus(), 100); } 
    else { overlay.classList.add('hidden'); input.value = ""; }
};

// --- NAVBAR LOGIC ---
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
                <button onclick="document.getElementById('auth-modal').classList.add('hidden'); resetAuthUI();" class="absolute top-2 right-4 text-gray-500 text-2xl hover:text-white">&times;</button>
                <h2 class="text-xl font-bold mb-4 text-white text-center" id="auth-title">Login / Signup</h2>
                
                <div id="auth-step-1">
                    <input type="email" id="auth-email" placeholder="Email Address" class="w-full bg-black border border-gray-700 text-white p-3 rounded mb-3 focus:border-red-600 outline-none">
                    <input type="password" id="auth-pass" placeholder="Password" class="w-full bg-black border border-gray-700 text-white p-3 rounded mb-4 focus:border-red-600 outline-none">
                    <div class="flex gap-2 flex-col">
                        <button id="btn-login" class="w-full bg-white text-black font-bold py-3 rounded hover:bg-gray-200">LOGIN</button>
                        <div class="flex items-center justify-between text-gray-500 text-xs my-1"><span>OR</span></div>
                        <button id="btn-init-signup" class="w-full border border-gray-600 text-white font-bold py-3 rounded hover:border-white transition">VERIFY & SIGNUP</button>
                    </div>
                </div>

                <div id="auth-step-2" class="hidden text-center">
                    <p class="text-gray-400 text-sm mb-4">OTP sent to <span id="otp-sent-email" class="text-white font-bold"></span></p>
                    <input type="number" id="auth-otp-input" placeholder="Enter OTP" class="w-full bg-black border border-gray-700 text-white p-3 rounded mb-4 text-center text-xl tracking-widest font-bold focus:border-green-500 outline-none">
                    <button id="btn-verify-otp" class="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700">CONFIRM & CREATE</button>
                    <button onclick="resetAuthUI()" class="mt-4 text-xs text-gray-500 underline">Cancel</button>
                </div>
                <p id="auth-msg" class="text-center text-xs mt-3 text-yellow-500 animate-pulse hidden">Processing...</p>
            </div>
        </div>
    `;

    getDoc(doc(db, "settings", "general")).then(snap => { if(snap.exists() && snap.data().logo) document.getElementById('nav-logo').src = snap.data().logo; });

    let generatedCustomerOTP = null;
    let tempEmail = "", tempPass = "";

    window.resetAuthUI = () => {
        document.getElementById('auth-step-1').classList.remove('hidden');
        document.getElementById('auth-step-2').classList.add('hidden');
        document.getElementById('auth-title').innerText = "Login / Signup";
        document.getElementById('auth-otp-input').value = "";
    };

    setTimeout(() => {
        const btnLogin = document.getElementById('btn-login');
        const btnInitSignup = document.getElementById('btn-init-signup');
        const btnVerifyOtp = document.getElementById('btn-verify-otp');
        const authMsg = document.getElementById('auth-msg');

        if(btnLogin) btnLogin.addEventListener('click', async () => {
            const email = document.getElementById('auth-email').value;
            const pass = document.getElementById('auth-pass').value;
            authMsg.innerText = "Logging in..."; authMsg.classList.remove('hidden');
            try {
                await signInWithEmailAndPassword(auth, email, pass);
                window.location.reload();
            } catch(e) { authMsg.innerText = "Error: " + e.message; authMsg.classList.add('text-red-500'); }
        });

        if(btnInitSignup) btnInitSignup.addEventListener('click', () => {
            tempEmail = document.getElementById('auth-email').value.trim();
            tempPass = document.getElementById('auth-pass').value;
            if(!tempEmail || tempPass.length < 6) return alert("Valid email & password (min 6 chars) required.");

            generatedCustomerOTP = Math.floor(100000 + Math.random() * 900000);
            authMsg.innerText = "Sending OTP..."; authMsg.classList.remove('hidden');
            btnInitSignup.disabled = true;

            const templateParams = { user_email: tempEmail, otp_code: generatedCustomerOTP };
            emailjs.send("service_3vbmeu4", "template_i1g09mi", templateParams)
                .then(() => {
                    authMsg.classList.add('hidden');
                    document.getElementById('auth-step-1').classList.add('hidden');
                    document.getElementById('auth-step-2').classList.remove('hidden');
                    document.getElementById('otp-sent-email').innerText = tempEmail;
                    document.getElementById('auth-title').innerText = "Verify Email";
                    btnInitSignup.disabled = false;
                }, (err) => {
                    alert("OTP Failed. Check console.");
                    console.error(err);
                    btnInitSignup.disabled = false;
                    authMsg.classList.add('hidden');
                });
        });

        if(btnVerifyOtp) btnVerifyOtp.addEventListener('click', async () => {
            if(parseInt(document.getElementById('auth-otp-input').value) === generatedCustomerOTP) {
                authMsg.innerText = "Creating Account..."; authMsg.classList.remove('hidden');
                try {
                    const uc = await createUserWithEmailAndPassword(auth, tempEmail, tempPass);
                    await setDoc(doc(db, "users", uc.user.uid), { email: tempEmail, role: "customer", createdAt: serverTimestamp() });
                    alert("✅ Account Created!"); window.location.reload();
                } catch(e) { alert(e.message); authMsg.classList.add('hidden'); }
            } else { alert("❌ Wrong OTP"); }
        });
    }, 500);

    const menuList = document.getElementById('menu-list');
    
    // 👇 YEH RAHA CATEGORIES FIX 👇
    const commonLinks = `<li><a href="index.html" class="block py-4 px-6 text-white hover:bg-gray-800 border-b border-gray-800 flex items-center gap-4">Home</a></li><li><a href="categories.html" class="block py-4 px-6 text-white hover:bg-gray-800 border-b border-gray-800 flex items-center gap-4">Categories</a></li>`;

    onAuthStateChanged(auth, (user) => {
        if(user) {
            menuList.innerHTML = `${commonLinks}<li><a href="orders.html" class="block py-4 px-6 text-white hover:bg-gray-800 border-b border-gray-800">My Orders</a></li><li><button id="logout-btn" class="w-full text-left py-4 px-6 text-red-500 hover:bg-gray-800 border-b border-gray-800">Logout</button></li>`;
            setTimeout(() => document.getElementById('logout-btn')?.addEventListener('click', () => signOut(auth).then(() => window.location.reload())), 500);
        } else {
            menuList.innerHTML = `${commonLinks}<li><button onclick="document.getElementById('auth-modal').classList.remove('hidden')" class="w-full text-left py-4 px-6 text-green-500 hover:bg-gray-800 border-b border-gray-800">Login / Signup</button></li>`;
        }
    });

    document.getElementById('menu-toggle')?.addEventListener('click', () => document.getElementById('mobile-menu').classList.toggle('hidden'));
    
    onAuthStateChanged(auth, (user) => {
        if (user) onSnapshot(collection(db, "carts", user.uid, "items"), (snap) => {
            const count = document.getElementById('cart-count');
            if(count) { count.innerText = snap.size; count.classList.toggle('hidden', snap.size === 0); }
        });
    });
}