// Chrome Performance Optimization Script
// تحسينات الأداء لمتصفح Chrome
(function() {
    'use strict';
    
    // تحسين الذاكرة والأداء
    if (window.chrome && window.chrome.runtime) {
        // تحسين استخدام الذاكرة
        const optimizeMemory = () => {
            if (window.gc && typeof window.gc === 'function') {
                try {
                    window.gc();
                } catch (e) {
                    // Silent fail
                }
            }
        };
        
        // تشغيل تحسين الذاكرة كل 30 ثانية
        setInterval(optimizeMemory, 30000);
    }
    
    // تحسين التحميل
    if ('requestIdleCallback' in window) {
        // تأخير العمليات غير الضرورية
        requestIdleCallback(() => {
            // تحسينات إضافية يمكن تطبيقها عند توفر وقت فراغ
            document.documentElement.style.scrollBehavior = 'smooth';
        });
    }
    
    // تحسين الرسوم المتحركة
    if ('animate' in Element.prototype) {
        const originalAnimate = Element.prototype.animate;
        Element.prototype.animate = function(...args) {
            // استخدام GPU acceleration
            if (args[0] && typeof args[0] === 'object') {
                const keyframes = args[0];
                if (Array.isArray(keyframes)) {
                    keyframes.forEach(frame => {
                        if (frame.transform || frame.opacity !== undefined) {
                            frame.willChange = 'transform, opacity';
                        }
                    });
                }
            }
            return originalAnimate.apply(this, args);
        };
    }
    
    console.log('🚀 Chrome performance optimizations loaded');
})();