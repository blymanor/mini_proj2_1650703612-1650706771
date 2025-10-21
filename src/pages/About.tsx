export default function About() {
  return (
    <section className="space-y-8">
      {/* ===== Hero / Intro ===== */}
      <div className="hero bg-base-100 rounded-2xl shadow">
        <div className="hero-content flex-col md:flex-row gap-8">
          {/* Avatar (optional) */}
          <div className="avatar">
            <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {/* TODO: เปลี่ยนรูปเป็นของทีมเอง หรือเอา <img> ออกได้ */}
              <img
                src="https://api.dicebear.com/8.x/thumbs/svg?seed=dev"
                alt="Profile"
              />
            </div>
          </div>

          <div>
            {/* TODO: ชื่อโปรเจกต์ */}
            <h1 className="text-3xl md:text-4xl font-bold">Project Name</h1>
            {/* TODO: คำอธิบายสั้น ๆ */}
            <p className="mt-3 opacity-80">
              Short description of the project. What it does, who it’s for, why
              it’s useful.
            </p>

            {/* Tech badges (แก้/ลบได้) */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge badge-primary">Vite</span>
              <span className="badge badge-secondary">React</span>
              <span className="badge">TypeScript</span>
              <span className="badge badge-outline">Redux Toolkit</span>
              <span className="badge badge-outline">React Router</span>
              <span className="badge">Tailwind</span>
              <span className="badge">DaisyUI</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Team / Role ===== */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">👩🏻‍💻 Team</h2>
              {/* TODO: รายชื่อสมาชิก/รหัส/หน้าที่ */}
              <ul className="list-disc ml-5 space-y-1">
                <li>Member 1 — Role</li>
                <li>Member 2 — Role</li>
                <li>Member 3 — Role</li>
              </ul>

              <div className="divider my-4" />

              <h3 className="font-semibold">Project Goals</h3>
              {/* TODO: ใส่เป้าหมายหลักสั้น ๆ */}
              <ul className="list-disc ml-5 space-y-1">
                <li>Goal A</li>
                <li>Goal B</li>
                <li>Goal C</li>
              </ul>

              <div className="divider my-4" />

              <h3 className="font-semibold">Features (สรุป)</h3>
              {/* TODO: ไฮไลต์ฟีเจอร์สำคัญ */}
              <ul className="list-disc ml-5 space-y-1">
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ===== Quick Stats / Links ===== */}
        <div className="space-y-6">
          {/* Stats (ตัวเลขเป็น placeholder) */}
          <div className="stats shadow w-full">
            <div className="stat">
              <div className="stat-title">Items</div>
              <div className="stat-value">20+</div>
              <div className="stat-desc">จำนวนข้อมูลขั้นต่ำ</div>
            </div>
            <div className="stat">
              <div className="stat-title">Pages</div>
              <div className="stat-value">6</div>
              <div className="stat-desc">
                Home / List / Detail / Extra / Collection / About
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">🔗 Links</h3>
              {/* TODO: เปลี่ยนเป็นลิงก์จริง */}
              <ul className="menu menu-sm bg-base-200 rounded-box">
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    Git Repository
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    Design / Docs
                  </a>
                </li>
                <li>
                  <a href="/data/recipes.json" target="_blank" rel="noreferrer">
                    Sample Data
                  </a>
                </li>
              </ul>
              {/* TODO: ติดต่อผู้รับผิดชอบโปรเจกต์ */}
              <div className="mt-3 text-sm opacity-70">
                Contact:{" "}
                <a className="link" href="mailto:email@example.com">
                  email@example.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== How it works / Architecture ===== */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">⚙️ How it works</h2>
          {/* TODO: ปรับตามโปรเจกต์จริง */}
          <ol className="list-decimal ml-5 space-y-2">
            <li>Data source: /data/xxx.json or API</li>
            <li>State management: Redux Toolkit slices</li>
            <li>Routing: React Router with dynamic route (e.g., /item/:id)</li>
            <li>Persistence: localStorage for personal collection</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
