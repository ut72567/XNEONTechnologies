import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, query, where, onSnapshot, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// 🔴 CONFIGURATION (xneon-c12a2)
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

export { db, auth, storage, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, query, where, onSnapshot, orderBy, serverTimestamp, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, ref, uploadBytes, getDownloadURL };

export const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

// --- NAVBAR LOGIC ---
export function loadNavbar() {
    const nav = document.getElementById('navbar');
    
    // 1. Render Structure (Fixed Fit)
    nav.innerHTML = `
        <nav class="w-full bg-black/95 backdrop-blur-md fixed top-0 z-50 border-b border-gray-800 shadow-md h-[70px] flex items-center">
            
            <div id="nav-main" class="w-full max-w-screen-xl mx-auto px-3 flex items-center justify-between">
                
                <a href="index.html" class="flex-shrink-0">
                    <img id="nav-logo" src="https://via.placeholder.com/150x50?text=XNEON+Technologies" class="h-10 md:h-12 w-auto object-contain transition-all" alt="XNEON Technologies">
                </a>

                <div class="flex-1"></div>

                <div class="flex items-center gap-2">
                    
                    <button id="open-search-btn" class="text-white hover:text-red-500 transition p-2 rounded-full hover:bg-gray-800 focus:outline-none cursor-pointer">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>

                    <a href="cart.html" class="relative text-white hover:text-red-500 transition p-2 rounded hover:bg-gray-800">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <span id="cart-count" class="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full hidden">0</span>
                    </a>

                    <button id="menu-toggle" class="text-white focus:outline-none p-2 rounded hover:bg-gray-800">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                </div>
            </div>

            <div id="search-overlay" class="hidden fixed top-0 left-0 w-full h-[70px] bg-black z-[100] flex items-center px-4 border-b border-gray-800 shadow-2xl transition-all duration-200">
                <div class="w-full max-w-screen-xl mx-auto flex items-center gap-3">
                    <div class="flex-1 relative">
                         <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input type="text" id="search-input" class="block w-full py-2 pl-10 pr-3 text-white bg-[#1a1a1a] border border-gray-700 rounded-lg focus:border-red-600 focus:outline-none placeholder-gray-500 text-base" placeholder="Search products...">
                    </div>
                    <button id="close-search-btn" class="text-gray-400 hover:text-white font-bold px-3 py-2 transition uppercase text-sm tracking-wide cursor-pointer">Cancel</button>
                </div>
            </div>

            <div id="mobile-menu" class="hidden bg-[#111] border-b border-gray-800 absolute w-full left-0 top-[70px] shadow-xl z-40 h-screen">
                <ul class="flex flex-col font-medium text-lg" id="menu-list">
                    </ul>
            </div>
        </nav>
        
        <div class="h-[70px]"></div> 

        <div id="auth-modal" class="fixed inset-0 bg-black/90 z-[60] hidden flex items-center justify-center p-4">
            <div class="bg-[#111] border border-gray-800 rounded-xl p-6 w-full max-w-sm relative">
                <button onclick="document.getElementById('auth-modal').classList.add('hidden')" class="absolute top-2 right-4 text-gray-500 text-2xl">&times;</button>
                <h2 class="text-xl font-bold mb-4 text-white">Login / Signup</h2>
                <input type="email" id="auth-email" placeholder="Email" class="w-full bg-black border border-gray-700 text-white p-3 rounded mb-3">
                <input type="password" id="auth-pass" placeholder="Password" class="w-full bg-black border border-gray-700 text-white p-3 rounded mb-4">
                <div class="flex gap-2">
                    <button id="btn-login" class="flex-1 bg-white text-black font-bold py-2 rounded">LOGIN</button>
                    <button id="btn-signup" class="flex-1 border border-white text-white font-bold py-2 rounded">SIGNUP</button>
                </div>
            </div>
        </div>
    `;

    // Fetch Logo
    getDoc(doc(db, "settings", "general")).then(snap => {
        if(snap.exists() && snap.data().logo) {
            document.getElementById('nav-logo').src = snap.data().logo;
        }
    });

    // --- ⚡ EVENT BINDING (Search Logic) ---
    setTimeout(() => {
        const openBtn = document.getElementById('open-search-btn');
        const closeBtn = document.getElementById('close-search-btn');
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('search-input');

        if(openBtn) {
            openBtn.onclick = function() {
                // Just Show Overlay - DO NOT FOCUS INPUT (No Keyboard)
                overlay.classList.remove('hidden');
            };
        }

        if(closeBtn) {
            closeBtn.onclick = function() {
                overlay.classList.add('hidden');
                input.value = ""; 
            };
        }
    }, 500);

    // --- MENU & AUTH LOGIC ---
    const menuList = document.getElementById('menu-list');
    const commonLinks = `
        <li>
            <a href="index.html" class="block py-4 px-6 text-white hover:bg-gray-800 border-b border-gray-800 flex items-center gap-4">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                <span>Home</span>
            </a>
        </li>
        <li>
            <a href="categories.html" class="block py-4 px-6 text-white hover:bg-gray-800 border-b border-gray-800 flex items-center gap-4">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                <span>Categories</span>
            </a>
        </li>
    `;

    onAuthStateChanged(auth, (user) => {
        const isUser = user && !user.isAnonymous;
        
        if(isUser) {
            menuList.innerHTML = `
                ${commonLinks}
                <li>
                    <a href="orders.html" class="block py-4 px-6 text-white hover:bg-gray-800 border-b border-gray-800 flex items-center gap-4">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                        <span>My Orders</span>
                    </a>
                </li>
                <li>
                    <button id="logout-btn" class="w-full text-left py-4 px-6 text-red-500 hover:bg-gray-800 flex items-center gap-4 border-b border-gray-800">
                        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        <span>Logout</span>
                    </button>
                </li>
            `;
            setTimeout(() => {
                const logoutBtn = document.getElementById('logout-btn');
                if(logoutBtn) logoutBtn.addEventListener('click', () => {
                    signOut(auth).then(() => window.location.reload());
                });
            }, 500);
        } else {
            menuList.innerHTML = `
                ${commonLinks}
                <li>
                    <button onclick="document.getElementById('auth-modal').classList.remove('hidden')" class="w-full text-left py-4 px-6 text-green-500 hover:bg-gray-800 flex items-center gap-4 border-b border-gray-800">
                        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                        <span>Login / Signup</span>
                    </button>
                </li>
            `;
            
             setTimeout(() => {
                const btnLogin = document.getElementById('btn-login');
                const btnSignup = document.getElementById('btn-signup');
                
                if(btnLogin) btnLogin.addEventListener('click', async () => {
                    try {
                        await signInWithEmailAndPassword(auth, document.getElementById('auth-email').value, document.getElementById('auth-pass').value);
                        window.location.reload();
                    } catch(e) { alert(e.message); }
                });

                if(btnSignup) btnSignup.addEventListener('click', async () => {
                    try {
                        await createUserWithEmailAndPassword(auth, document.getElementById('auth-email').value, document.getElementById('auth-pass').value);
                        window.location.reload();
                    } catch(e) { alert(e.message); }
                });
             }, 500);
        }
    });

    const menuToggle = document.getElementById('menu-toggle');
    if(menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
    }

    updateCartCount();
}

function updateCartCount() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            onSnapshot(collection(db, "carts", user.uid, "items"), (snap) => {
                const count = document.getElementById('cart-count');
                if (count) {
                    if (snap.size > 0) {
                        count.innerText = snap.size;
                        count.classList.remove('hidden');
                    } else {
                        count.classList.add('hidden');
                    }
                }
            });
        }
    });
}
