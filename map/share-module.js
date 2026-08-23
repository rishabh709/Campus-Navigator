// share-module.js
// Manages the share location popup and link generation

(function () {
	// Configuration
	const SERVER_URL = 'http://localhost:3000'; // Change to your production server URL
	// const SERVER_URL = 'https://loud-showers-cut.loca.lt/'; // Change to your production server URL
	const SHARE_LINK_BASE = window.location.origin + window.location.pathname.replace('index.html', '') + 'viewer.html?token=';

	// DOM elements
	const shareLocationIcon = document.getElementById('sharelocation');
	const shareModal = document.getElementById('shareLocationModal');
	const durationInput = document.getElementById('shareDurationInput');
	const generateBtn = document.getElementById('generateShareBtn');
	const closeBtn = document.getElementById('closeShareModalBtn');
	const copyBtn = document.getElementById('copyShareLinkBtn');
	const shareLinkInput = document.getElementById('shareLinkInput');
	const shareLinkBox = document.getElementById('shareLinkBox');

	let currentShareToken = null;
	let currentShareRoom = null;

	// Open share modal
	function openShareModal() {
		shareModal.style.display = 'block';
		// Reset form
		durationInput.value = '30';
		shareLinkInput.value = '';
		shareLinkBox.style.display = 'none';
		generateBtn.textContent = 'Generate & Start Sharing';
		generateBtn.style.background = '#46bd4a';
	}

	// Close share modal
	function closeShareModal() {
		shareModal.style.display = 'none';
	}

	// Generate share link and start publishing
	async function generateShareLink() {
		try {
			generateBtn.disabled = true;
			generateBtn.textContent = 'Generating...';

			// Request share from server
			const duration = parseInt(durationInput.value) || 30;
			const response = await fetch(`${SERVER_URL}/create-share`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});

			if (!response.ok) {
				throw new Error('Failed to create share on server');
			}

			const shareData = await response.json();
			currentShareToken = shareData.senderToken;
			currentShareRoom = shareData.room;

			// Start publishing live location
			window.startPublishingShare(SERVER_URL, currentShareToken);

			// Generate share link
			const shareLink = SHARE_LINK_BASE + shareData.viewerToken;
			shareLinkInput.value = shareLink;
			shareLinkBox.style.display = 'block';

			generateBtn.textContent = 'Sharing Active';
			generateBtn.style.background = '#ff6b6b';
			generateBtn.disabled = false;

			console.log('Share link:', shareLink);
			console.log('Room:', currentShareRoom);

			// Optional: Set expiry based on duration
			setTimeout(() => {
				stopSharing();
			}, duration * 60 * 1000);
		} catch (err) {
			console.error('Error generating share link:', err);
			alert('Failed to generate share link. Make sure the server is running on ' + SERVER_URL);
			generateBtn.disabled = false;
			generateBtn.textContent = 'Generate & Start Sharing';
			generateBtn.style.background = '#46bd4a';
		}
	}

	// Stop sharing
	function stopSharing() {
		window.stopPublishingShare();
		currentShareToken = null;
		currentShareRoom = null;
		shareLinkBox.style.display = 'none';
		generateBtn.textContent = 'Generate & Start Sharing';
		generateBtn.style.background = '#46bd4a';
		generateBtn.disabled = false;
	}

	// Copy share link to clipboard
	function copyShareLink() {
		const link = shareLinkInput.value;
		if (!link) return;

		navigator.clipboard.writeText(link).then(() => {
			copyBtn.textContent = 'Copied!';
			setTimeout(() => {
				copyBtn.textContent = 'Copy';
			}, 2000);
		}).catch(() => {
			alert('Failed to copy link');
		});
	}

	// Event listeners
	shareLocationIcon.addEventListener('click', openShareModal);
	closeBtn.addEventListener('click', closeShareModal);
	generateBtn.addEventListener('click', generateShareLink);
	copyBtn.addEventListener('click', copyShareLink);

	// Close modal when clicking outside of it
	shareModal.addEventListener('click', (e) => {
		if (e.target === shareModal) {
			closeShareModal();
		}
	});

	// Expose functions on window for debugging/access from other modules
	window.openShareModal = openShareModal;
	window.closeShareModal = closeShareModal;
	window.stopSharing = stopSharing;
})();
