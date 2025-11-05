/**
 * Modern Components Library
 * Beautiful, pre-styled components for the modern page builder
 */

if (typeof Vvveb !== 'undefined') {

    // Modern Hero Section
    Vvveb.Components.extend("_base", "modern/hero", {
        name: "Modern Hero",
        image: "icons/hero.svg",
        classes: ["modern-hero"],
        html: `
            <section class="modern-hero" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 100px 0; color: white;">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-6">
                            <h1 class="display-3 fw-bold mb-4">Build Amazing Websites</h1>
                            <p class="lead mb-4">Create stunning pages with our intuitive drag-and-drop builder. No coding required.</p>
                            <div class="d-flex gap-3">
                                <a href="#" class="btn btn-light btn-lg">Get Started</a>
                                <a href="#" class="btn btn-outline-light btn-lg">Learn More</a>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <img src="https://via.placeholder.com/600x400" class="img-fluid rounded" alt="Hero Image">
                        </div>
                    </div>
                </div>
            </section>
        `,
        properties: [{
            name: "Background",
            key: "background",
            htmlAttr: "style",
            inputtype: "TextInput"
        }]
    });

    // Modern Feature Card
    Vvveb.Components.extend("_base", "modern/feature-card", {
        name: "Feature Card",
        image: "icons/card.svg",
        classes: ["feature-card"],
        html: `
            <div class="feature-card" style="background: white; border-radius: 1rem; padding: 2rem; border: 1px solid #e5e7eb; transition: all 0.3s ease;">
                <div class="feature-icon mb-3" style="width: 64px; height: 64px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                    <i class="la la-star"></i>
                </div>
                <h3 class="h4 mb-3">Amazing Feature</h3>
                <p class="text-muted">Describe your amazing feature here. Make it compelling and easy to understand.</p>
            </div>
        `,
        properties: [{
            name: "Title",
            key: "title",
            htmlAttr: "innerHTML",
            child: "h3",
            inputtype: "TextInput"
        }, {
            name: "Description",
            key: "description",
            htmlAttr: "innerHTML",
            child: "p",
            inputtype: "TextareaInput"
        }]
    });

    // Modern Pricing Card
    Vvveb.Components.extend("_base", "modern/pricing-card", {
        name: "Pricing Card",
        image: "icons/pricing.svg",
        classes: ["pricing-card"],
        html: `
            <div class="pricing-card" style="background: white; border-radius: 1rem; padding: 2.5rem; border: 2px solid #e5e7eb; text-align: center; transition: all 0.3s ease;">
                <h3 class="h4 mb-3">Starter</h3>
                <div class="price mb-4">
                    <span class="display-4 fw-bold" style="color: #667eea;">$19</span>
                    <span class="text-muted">/month</span>
                </div>
                <ul class="list-unstyled mb-4">
                    <li class="mb-3">5 Projects</li>
                    <li class="mb-3">All Components</li>
                    <li class="mb-3">Export Code</li>
                    <li class="mb-3">Email Support</li>
                </ul>
                <a href="#" class="btn btn-primary w-100" style="border-radius: 50px; padding: 0.75rem;">Get Started</a>
            </div>
        `,
        properties: [{
            name: "Plan Name",
            key: "plan",
            htmlAttr: "innerHTML",
            child: "h3",
            inputtype: "TextInput"
        }, {
            name: "Price",
            key: "price",
            htmlAttr: "innerHTML",
            child: ".display-4",
            inputtype: "TextInput"
        }]
    });

    // Modern CTA Section
    Vvveb.Components.extend("_base", "modern/cta", {
        name: "Call to Action",
        image: "icons/cta.svg",
        classes: ["modern-cta"],
        html: `
            <section class="modern-cta" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 80px 0; color: white; text-align: center;">
                <div class="container">
                    <h2 class="display-4 fw-bold mb-4">Ready to Get Started?</h2>
                    <p class="lead mb-5">Join thousands of users building amazing websites today.</p>
                    <div class="d-flex gap-3 justify-content-center">
                        <a href="#" class="btn btn-light btn-lg" style="border-radius: 50px; padding: 0.75rem 2rem;">Start Free Trial</a>
                        <a href="#" class="btn btn-outline-light btn-lg" style="border-radius: 50px; padding: 0.75rem 2rem;">Contact Us</a>
                    </div>
                </div>
            </section>
        `,
        properties: [{
            name: "Heading",
            key: "heading",
            htmlAttr: "innerHTML",
            child: "h2",
            inputtype: "TextInput"
        }, {
            name: "Description",
            key: "description",
            htmlAttr: "innerHTML",
            child: "p",
            inputtype: "TextareaInput"
        }]
    });

    // Modern Testimonial Card
    Vvveb.Components.extend("_base", "modern/testimonial", {
        name: "Testimonial",
        image: "icons/testimonial.svg",
        classes: ["testimonial-card"],
        html: `
            <div class="testimonial-card" style="background: white; border-radius: 1rem; padding: 2rem; border: 1px solid #e5e7eb;">
                <div class="d-flex mb-3">
                    <i class="la la-star" style="color: #f59e0b; font-size: 1.25rem;"></i>
                    <i class="la la-star" style="color: #f59e0b; font-size: 1.25rem;"></i>
                    <i class="la la-star" style="color: #f59e0b; font-size: 1.25rem;"></i>
                    <i class="la la-star" style="color: #f59e0b; font-size: 1.25rem;"></i>
                    <i class="la la-star" style="color: #f59e0b; font-size: 1.25rem;"></i>
                </div>
                <p class="mb-4">"This page builder is absolutely amazing! It made creating our website so easy and fast. Highly recommended!"</p>
                <div class="d-flex align-items-center">
                    <img src="https://via.placeholder.com/50" class="rounded-circle me-3" alt="User" style="width: 50px; height: 50px;">
                    <div>
                        <h6 class="mb-0">John Doe</h6>
                        <small class="text-muted">CEO, Company Inc.</small>
                    </div>
                </div>
            </div>
        `,
        properties: [{
            name: "Testimonial Text",
            key: "text",
            htmlAttr: "innerHTML",
            child: "p",
            inputtype: "TextareaInput"
        }, {
            name: "Author Name",
            key: "author",
            htmlAttr: "innerHTML",
            child: "h6",
            inputtype: "TextInput"
        }]
    });

    // Modern Stats Counter
    Vvveb.Components.extend("_base", "modern/stats", {
        name: "Stats Counter",
        image: "icons/stats.svg",
        classes: ["stats-counter"],
        html: `
            <div class="stats-counter text-center" style="padding: 2rem;">
                <div class="stat-number" style="font-size: 3rem; font-weight: 700; color: #667eea; line-height: 1;">1000+</div>
                <div class="stat-label" style="color: #6b7280; margin-top: 0.5rem; font-size: 1.1rem;">Happy Customers</div>
            </div>
        `,
        properties: [{
            name: "Number",
            key: "number",
            htmlAttr: "innerHTML",
            child: ".stat-number",
            inputtype: "TextInput"
        }, {
            name: "Label",
            key: "label",
            htmlAttr: "innerHTML",
            child: ".stat-label",
            inputtype: "TextInput"
        }]
    });

    // Modern Contact Form
    Vvveb.Components.extend("_base", "modern/contact-form", {
        name: "Contact Form",
        image: "icons/form.svg",
        classes: ["modern-contact-form"],
        html: `
            <div class="modern-contact-form" style="background: white; border-radius: 1rem; padding: 2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
                <h3 class="h4 mb-4">Get in Touch</h3>
                <form>
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-control" style="border-radius: 0.5rem; padding: 0.75rem;">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" style="border-radius: 0.5rem; padding: 0.75rem;">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Message</label>
                        <textarea class="form-control" rows="4" style="border-radius: 0.5rem; padding: 0.75rem;"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary w-100" style="border-radius: 50px; padding: 0.75rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;">Send Message</button>
                </form>
            </div>
        `,
        properties: [{
            name: "Form Title",
            key: "title",
            htmlAttr: "innerHTML",
            child: "h3",
            inputtype: "TextInput"
        }]
    });

    // Modern Image Grid
    Vvveb.Components.extend("_base", "modern/image-grid", {
        name: "Image Grid",
        image: "icons/grid.svg",
        classes: ["modern-image-grid"],
        html: `
            <div class="modern-image-grid">
                <div class="row g-4">
                    <div class="col-md-4">
                        <img src="https://via.placeholder.com/400x300" class="img-fluid" style="border-radius: 1rem; width: 100%; height: auto; transition: transform 0.3s ease;" alt="Image 1">
                    </div>
                    <div class="col-md-4">
                        <img src="https://via.placeholder.com/400x300" class="img-fluid" style="border-radius: 1rem; width: 100%; height: auto; transition: transform 0.3s ease;" alt="Image 2">
                    </div>
                    <div class="col-md-4">
                        <img src="https://via.placeholder.com/400x300" class="img-fluid" style="border-radius: 1rem; width: 100%; height: auto; transition: transform 0.3s ease;" alt="Image 3">
                    </div>
                </div>
            </div>
        `
    });

    // Modern Team Member Card
    Vvveb.Components.extend("_base", "modern/team-member", {
        name: "Team Member",
        image: "icons/team.svg",
        classes: ["team-member-card"],
        html: `
            <div class="team-member-card text-center" style="background: white; border-radius: 1rem; padding: 2rem; border: 1px solid #e5e7eb; transition: all 0.3s ease;">
                <img src="https://via.placeholder.com/150" class="rounded-circle mb-3" style="width: 120px; height: 120px; object-fit: cover;" alt="Team Member">
                <h4 class="h5 mb-2">Jane Smith</h4>
                <p class="text-muted mb-3">Product Designer</p>
                <div class="social-links d-flex justify-content-center gap-2">
                    <a href="#" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 50%; color: #667eea; transition: all 0.3s ease;">
                        <i class="la la-twitter"></i>
                    </a>
                    <a href="#" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 50%; color: #667eea; transition: all 0.3s ease;">
                        <i class="la la-linkedin"></i>
                    </a>
                    <a href="#" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border-radius: 50%; color: #667eea; transition: all 0.3s ease;">
                        <i class="la la-github"></i>
                    </a>
                </div>
            </div>
        `,
        properties: [{
            name: "Name",
            key: "name",
            htmlAttr: "innerHTML",
            child: "h4",
            inputtype: "TextInput"
        }, {
            name: "Role",
            key: "role",
            htmlAttr: "innerHTML",
            child: "p",
            inputtype: "TextInput"
        }]
    });

    // Modern Progress Bar
    Vvveb.Components.extend("_base", "modern/progress", {
        name: "Progress Bar",
        image: "icons/progress.svg",
        classes: ["modern-progress"],
        html: `
            <div class="modern-progress mb-3">
                <div class="d-flex justify-content-between mb-2">
                    <span style="font-weight: 600; color: #1f2937;">Design Skills</span>
                    <span style="color: #667eea; font-weight: 600;">90%</span>
                </div>
                <div style="height: 12px; background: #e5e7eb; border-radius: 50px; overflow: hidden;">
                    <div style="width: 90%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); transition: width 0.3s ease;"></div>
                </div>
            </div>
        `,
        properties: [{
            name: "Label",
            key: "label",
            htmlAttr: "innerHTML",
            child: "span:first-child",
            inputtype: "TextInput"
        }, {
            name: "Percentage",
            key: "percentage",
            htmlAttr: "innerHTML",
            child: "span:last-child",
            inputtype: "NumberInput"
        }]
    });

    // Add modern components to a group
    Vvveb.ComponentsGroup['Modern Components'] = [
        "modern/hero",
        "modern/feature-card",
        "modern/pricing-card",
        "modern/cta",
        "modern/testimonial",
        "modern/stats",
        "modern/contact-form",
        "modern/image-grid",
        "modern/team-member",
        "modern/progress"
    ];

    console.log('Modern components library loaded! 🎨');
}
