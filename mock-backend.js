// Minimaler Mock-Server für die wichtigsten Endpunkte
// Start: node mock-backend.js

import http from 'http';

const PORT = 5500;

function readJsonBody(req) {
	return new Promise((resolve) => {
		let data = '';
		req.on('data', chunk => { data += chunk; });
		req.on('end', () => {
			try { resolve(JSON.parse(data || '{}')); } catch { resolve({}); }
		});
	});
}

function json(res, obj) {
	const body = JSON.stringify(obj);
	res.writeHead(200, {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*'
	});
	res.end(body);
}

const server = http.createServer(async (req, res) => {
	// Preflight
	if (req.method === 'OPTIONS') {
		res.writeHead(204, {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
			'Access-Control-Allow-Headers': 'content-type, x-token-pm'
		});
		return res.end();
	}

	if (req.method === 'POST' && req.url === '/servlet/login') {
		const body = await readJsonBody(req);
		const username = body?.username || 'Testuser';
		const userId = 1;
		return json(res, {
			success: true,
			user: {
				id: userId,
				klasse_id: 1,
				schule_id: 1,
				is_teacher: false,
				is_admin: false,
				is_schooladmin: false,
				locked: false,
				username,
				familienname: 'User',
				rufname: 'Test',
				currentWorkspace_id: 101,
				settings: {
					helperHistory: {
						newWorkspaceHelperDone: false,
						newFileHelperDone: false,
						speedControlHelperDone: false,
						consoleHelperDone: false,
						homeButtonHelperDone: false,
						stepButtonHelperDone: false,
						repositoryButtonDone: false,
						folderButtonDone: false
					},
					viewModes: null,
					classDiagram: null
				}
			},
			classdata: [],
			workspaces: {
				workspaces: [
					{
						name: 'Mein Workspace',
						path: '',
						isFolder: false,
						id: 101,
						owner_id: userId,
						files: [
							{
								name: 'Main.java',
								id: 1001,
								text: 'class Main {\n    public static void main(String[] args){\n        println("Hallo Welt!");\n    }\n}',
								text_before_revision: '',
								submitted_date: '',
								student_edited_after_revision: false,
								version: 1,
								workspace_id: 101,
								forceUpdate: false,
								identical_to_repository_version: true
							}
						],
						current_file_id: 1001,
						version: 1,
						repository_id: null,
						has_write_permission_to_repository: true,
						pruefung_id: null,
						readonly: false,
						spritesheet_id: null
					}
				]
			},
			isTestuser: true,
			activePruefung: null,
			sqlIdeForOnlineIdeClient: ''
		});
	}

	if (req.method === 'POST' && req.url === '/servlet/sendUpdates') {
		return json(res, { success: true, workspaces: { workspaces: [] }, filesToForceUpdate: [], activePruefung: null });
	}

	if (req.method === 'POST' && req.url === '/servlet/updateUserSettings') {
		return json(res, { success: true });
	}

	if (req.method === 'POST' && req.url === '/servlet/createOrDeleteFileOrWorkspace') {
		const body = await readJsonBody(req);
		if (body?.type === 'create' && body?.entity === 'file') {
			return json(res, { success: true, id: Math.floor(Math.random() * 1000000), error: '' });
		}
		if (body?.type === 'create' && body?.entity === 'workspace') {
			return json(res, { success: true, id: Math.floor(Math.random() * 1000000), error: '' });
		}
		return json(res, { success: true, error: '' });
	}

	// Fallback
	res.writeHead(404, { 'Content-Type': 'text/plain' });
	res.end('Not Found');
});

server.listen(PORT, () => {
	console.log(`Mock-Backend läuft auf http://localhost:${PORT}`);
});


