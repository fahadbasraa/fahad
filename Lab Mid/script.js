document.addEventListener('DOMContentLoaded', function() {
    const profilePicture = document.querySelector('.profile-picture');
    const tooltip = profilePicture.querySelector('.tooltip');

    // Show tooltip on hover
    profilePicture.addEventListener('mouseover', function() {
        tooltip.style.display = 'block';
    });

    // Hide tooltip when not hovering
    profilePicture.addEventListener('mouseout', function() {
        tooltip.style.display = 'none';
    });
});
