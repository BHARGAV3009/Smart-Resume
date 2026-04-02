const API = "http://localhost:8081/api";

async function test(name, reqCall, expectedStatus1, expectedStatus2 = expectedStatus1) {
    try {
        const res = await reqCall();
        const ok = res.status === expectedStatus1 || res.status === expectedStatus2;
        let text = "";
        try { text = await res.text(); } catch(e){}
        console.log(`[${ok ? 'PASS' : 'FAIL'}] ${name} - Expected: ${expectedStatus1}/${expectedStatus2}, Got: ${res.status}. Response: ${text.substring(0, 100)}`);
        return { res, text, ok };
    } catch (e) {
        console.log(`[FAIL] ${name} - Error: ${e.message}`);
        return { ok: false };
    }
}

async function runTests() {
    let token = "";
    let resumeId = 0;
    const randEmail = `test_${Date.now()}@example.com`;

    console.log("=== 1. Auth Tests ===");
    await test("Register Missing Fields", () => fetch(`${API}/auth/register`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email: "bad" }) }), 400, 500);
    
    const reg = await test("Valid Register", () => fetch(`${API}/auth/register`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ name: "Tester", email: randEmail, password: "password123" }) }), 200);
    if(reg.ok) {
        const p = JSON.parse(reg.text);
        token = p.token;
    }

    await test("Login Wrong Password", () => fetch(`${API}/auth/login`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email: randEmail, password: "wrong" }) }), 401, 403);
    const login = await test("Valid Login", () => fetch(`${API}/auth/login`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email: randEmail, password: "password123" }) }), 200);

    console.log("\n=== 2. Resumes Tests ===");
    await test("Get Resumes No Token", () => fetch(`${API}/resumes`), 403, 401);
    await test("Get Resumes Valid Token", () => fetch(`${API}/resumes`, { headers: { 'Authorization': `Bearer ${token}` } }), 200);

    const createReq = { title: "Test Resume", fullName: "John Doe", template: "classic" };
    const create = await test("Create Resume", () => fetch(`${API}/resumes`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(createReq) }), 200, 201);
    
    if(create.ok) {
        try { resumeId = JSON.parse(create.text).id; } catch(e){}
    }

    console.log("Using ResumeID: " + resumeId);
    
    await test("Get Resume Without Token (Vulnerability Check)", () => fetch(`${API}/resumes/${resumeId}`), 403, 401);
    await test("Get Resume With Token", () => fetch(`${API}/resumes/${resumeId}`, { headers: { 'Authorization': `Bearer ${token}` } }), 200);

    console.log("\n=== 3. Scores Tests ===");
    await test("Analyze Score No Token", () => fetch(`${API}/scores/analyze/${resumeId}`, { method: 'POST' }), 403, 401);
    await test("Analyze Score With Token", () => fetch(`${API}/scores/analyze/${resumeId}`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }), 200);
    await test("Get Score No Token", () => fetch(`${API}/scores/${resumeId}`), 403, 401);

    console.log("\n=== 4. Edge Cases ===");
    await test("Delete missing resume", () => fetch(`${API}/resumes/999999`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }), 404, 500);
    await test("Delete Resume", () => fetch(`${API}/resumes/${resumeId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }), 204, 200);

    console.log("\n=== Tests Complete ===");
}

runTests();
