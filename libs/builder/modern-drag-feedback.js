/**
 * Modern Drag and Drop Visual Feedback
 * Enhances the drag-and-drop experience with smooth animations and visual indicators
 */

(function() {
    'use strict';

    // Drag feedback manager
    const DragFeedback = {
        dragIndicator: null,
        dropZone: null,
        originalElement: null,
        ghostElement: null,

        init: function() {
            this.createDragIndicator();
            this.enhanceBuilderDrag();
            this.addDropZoneEffects();
            this.addSmoothScrolling();
        },

        // Create floating drag indicator
        createDragIndicator: function() {
            this.dragIndicator = document.createElement('div');
            this.dragIndicator.className = 'drag-indicator';
            this.dragIndicator.style.display = 'none';
            this.dragIndicator.innerHTML = `
                <i class="la la-hand-rock"></i>
                <span class="drag-text">Dragging...</span>
            `;
            document.body.appendChild(this.dragIndicator);
        },

        // Show drag indicator
        showDragIndicator: function(x, y, text) {
            if (!this.dragIndicator) return;

            this.dragIndicator.style.display = 'flex';
            this.dragIndicator.style.left = (x + 20) + 'px';
            this.dragIndicator.style.top = (y + 20) + 'px';

            if (text) {
                this.dragIndicator.querySelector('.drag-text').textContent = text;
            }

            // Add pulse animation
            this.dragIndicator.style.animation = 'fadeIn 0.3s ease, pulse 1s ease infinite';
        },

        // Hide drag indicator
        hideDragIndicator: function() {
            if (!this.dragIndicator) return;
            this.dragIndicator.style.display = 'none';
            this.dragIndicator.style.animation = 'none';
        },

        // Update drag indicator position
        updateDragIndicator: function(x, y) {
            if (!this.dragIndicator) return;
            this.dragIndicator.style.left = (x + 20) + 'px';
            this.dragIndicator.style.top = (y + 20) + 'px';
        },

        // Enhance builder drag functionality
        enhanceBuilderDrag: function() {
            const self = this;

            // Hook into Vvveb's drag system
            if (typeof Vvveb !== 'undefined' && Vvveb.Builder) {
                // Store original drag functions
                const originalDragStart = Vvveb.Builder._dragStart;
                const originalDragMove = Vvveb.Builder._dragMove;
                const originalDragEnd = Vvveb.Builder._dragEnd;

                // Override drag start
                if (originalDragStart) {
                    Vvveb.Builder._dragStart = function(element, event) {
                        const componentName = element.getAttribute('data-name') || 'Component';
                        self.showDragIndicator(event.pageX, event.pageY, `Dragging ${componentName}`);

                        // Add ghost effect to original element
                        self.originalElement = element;
                        element.style.opacity = '0.5';
                        element.style.transform = 'scale(0.95)';

                        return originalDragStart.apply(this, arguments);
                    };
                }

                // Override drag move
                if (originalDragMove) {
                    Vvveb.Builder._dragMove = function(event) {
                        self.updateDragIndicator(event.pageX, event.pageY);
                        return originalDragMove.apply(this, arguments);
                    };
                }

                // Override drag end
                if (originalDragEnd) {
                    Vvveb.Builder._dragEnd = function(event) {
                        self.hideDragIndicator();

                        // Reset original element
                        if (self.originalElement) {
                            self.originalElement.style.opacity = '';
                            self.originalElement.style.transform = '';
                            self.originalElement = null;
                        }

                        // Add drop animation
                        self.addDropAnimation(event);

                        return originalDragEnd.apply(this, arguments);
                    };
                }
            }
        },

        // Add drop animation
        addDropAnimation: function(event) {
            const dropPoint = document.createElement('div');
            dropPoint.style.position = 'fixed';
            dropPoint.style.left = event.pageX + 'px';
            dropPoint.style.top = event.pageY + 'px';
            dropPoint.style.width = '20px';
            dropPoint.style.height = '20px';
            dropPoint.style.borderRadius = '50%';
            dropPoint.style.background = 'radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, rgba(102, 126, 234, 0) 70%)';
            dropPoint.style.transform = 'scale(0)';
            dropPoint.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            dropPoint.style.opacity = '1';
            dropPoint.style.pointerEvents = 'none';
            dropPoint.style.zIndex = '10001';

            document.body.appendChild(dropPoint);

            // Trigger animation
            setTimeout(() => {
                dropPoint.style.transform = 'scale(10)';
                dropPoint.style.opacity = '0';
            }, 10);

            // Remove element after animation
            setTimeout(() => {
                document.body.removeChild(dropPoint);
            }, 600);
        },

        // Add drop zone effects
        addDropZoneEffects: function() {
            // Add hover effects to potential drop zones
            document.addEventListener('mouseover', function(e) {
                if (Vvveb && Vvveb.Builder && Vvveb.Builder.isDragging) {
                    const target = e.target;
                    if (target && target.classList && !target.classList.contains('drop-zone-active')) {
                        target.classList.add('drop-zone-active');

                        // Remove class after short delay
                        setTimeout(() => {
                            target.classList.remove('drop-zone-active');
                        }, 300);
                    }
                }
            });
        },

        // Add smooth scrolling during drag
        addSmoothScrolling: function() {
            let scrollInterval = null;
            const scrollSpeed = 10;
            const scrollThreshold = 50;

            document.addEventListener('mousemove', function(e) {
                if (Vvveb && Vvveb.Builder && Vvveb.Builder.isDragging) {
                    const windowHeight = window.innerHeight;
                    const mouseY = e.clientY;

                    // Clear existing interval
                    if (scrollInterval) {
                        clearInterval(scrollInterval);
                        scrollInterval = null;
                    }

                    // Scroll up
                    if (mouseY < scrollThreshold) {
                        scrollInterval = setInterval(() => {
                            window.scrollBy(0, -scrollSpeed);
                        }, 16);
                    }
                    // Scroll down
                    else if (mouseY > windowHeight - scrollThreshold) {
                        scrollInterval = setInterval(() => {
                            window.scrollBy(0, scrollSpeed);
                        }, 16);
                    }
                }
            });

            document.addEventListener('mouseup', function() {
                if (scrollInterval) {
                    clearInterval(scrollInterval);
                    scrollInterval = null;
                }
            });
        }
    };

    // Component hover preview
    const ComponentPreview = {
        previewElement: null,

        init: function() {
            this.createPreviewElement();
            this.addHoverListeners();
        },

        createPreviewElement: function() {
            this.previewElement = document.createElement('div');
            this.previewElement.className = 'component-preview';
            this.previewElement.style.cssText = `
                position: fixed;
                background: white;
                border: 2px solid #667eea;
                border-radius: 0.5rem;
                padding: 1rem;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                max-width: 300px;
                z-index: 10002;
                display: none;
                pointer-events: none;
            `;
            document.body.appendChild(this.previewElement);
        },

        show: function(x, y, content) {
            if (!this.previewElement) return;

            this.previewElement.innerHTML = content;
            this.previewElement.style.display = 'block';
            this.previewElement.style.left = (x + 30) + 'px';
            this.previewElement.style.top = (y - 50) + 'px';
            this.previewElement.style.animation = 'fadeIn 0.2s ease';
        },

        hide: function() {
            if (!this.previewElement) return;
            this.previewElement.style.display = 'none';
        },

        addHoverListeners: function() {
            const self = this;

            // Add to components
            document.addEventListener('mouseover', function(e) {
                const component = e.target.closest('.component');
                if (component && !Vvveb.Builder.isDragging) {
                    const name = component.getAttribute('data-name');
                    const description = component.getAttribute('data-description');

                    if (name) {
                        const content = `
                            <h6 class="mb-2" style="color: #667eea; font-weight: 600;">${name}</h6>
                            ${description ? `<p class="mb-0" style="font-size: 0.875rem; color: #6b7280;">${description}</p>` : ''}
                            <div class="mt-2" style="font-size: 0.75rem; color: #9ca3af;">
                                <i class="la la-hand-rock"></i> Drag to add
                            </div>
                        `;
                        self.show(e.pageX, e.pageY, content);
                    }
                }
            });

            document.addEventListener('mouseout', function(e) {
                const component = e.target.closest('.component');
                if (component) {
                    self.hide();
                }
            });
        }
    };

    // Highlight enhancements
    const HighlightEnhancements = {
        init: function() {
            this.enhanceHighlightBox();
            this.enhanceSelectBox();
        },

        enhanceHighlightBox: function() {
            // Add smooth transitions to highlight box
            const style = document.createElement('style');
            style.innerHTML = `
                #highlight-box {
                    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }

                #highlight-box::before {
                    content: '';
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    opacity: 0.1;
                    border-radius: 2px;
                    z-index: -1;
                }

                #highlight-name {
                    animation: slideInUp 0.2s ease;
                }
            `;
            document.head.appendChild(style);
        },

        enhanceSelectBox: function() {
            // Add smooth transitions to select box
            const style = document.createElement('style');
            style.innerHTML = `
                #select-box {
                    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }

                #select-box::before {
                    content: '';
                    position: absolute;
                    top: -4px;
                    left: -4px;
                    right: -4px;
                    bottom: -4px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    opacity: 0.05;
                    border-radius: 4px;
                    z-index: -1;
                }

                #select-actions {
                    animation: slideInUp 0.3s ease;
                }

                #select-actions .btn-action {
                    animation: fadeIn 0.3s ease;
                }

                #select-actions .btn-action:nth-child(1) { animation-delay: 0s; }
                #select-actions .btn-action:nth-child(2) { animation-delay: 0.05s; }
                #select-actions .btn-action:nth-child(3) { animation-delay: 0.1s; }
                #select-actions .btn-action:nth-child(4) { animation-delay: 0.15s; }
                #select-actions .btn-action:nth-child(5) { animation-delay: 0.2s; }
                #select-actions .btn-action:nth-child(6) { animation-delay: 0.25s; }
                #select-actions .btn-action:nth-child(7) { animation-delay: 0.3s; }
            `;
            document.head.appendChild(style);
        }
    };

    // Success notifications
    const Notifications = {
        show: function(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `modern-notification notification-${type}`;
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 10003;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 600;
                animation: slideInRight 0.3s ease;
            `;

            const icon = type === 'success' ? 'la-check-circle' : 'la-info-circle';
            notification.innerHTML = `
                <i class="la ${icon}" style="font-size: 1.5rem;"></i>
                <span>${message}</span>
            `;

            document.body.appendChild(notification);

            // Auto remove after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            DragFeedback.init();
            ComponentPreview.init();
            HighlightEnhancements.init();

            // Show welcome notification
            setTimeout(() => {
                Notifications.show('Modern Page Builder Ready! 🚀');
            }, 1000);
        });
    } else {
        DragFeedback.init();
        ComponentPreview.init();
        HighlightEnhancements.init();

        // Show welcome notification
        setTimeout(() => {
            Notifications.show('Modern Page Builder Ready! 🚀');
        }, 1000);
    }

    // Export for external use
    window.ModernBuilder = {
        DragFeedback: DragFeedback,
        ComponentPreview: ComponentPreview,
        HighlightEnhancements: HighlightEnhancements,
        Notifications: Notifications
    };

})();
