$(document).ready(function () {
  // Smooth scroll for all anchor links with hashes
  $("a[href^='#']").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();

      const hash = this.hash;

      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        800,
        function () {
          // Update URL with the hash after scroll
          window.location.hash = hash;
        }
      );

      // Automatically close hamburger menu after clicking a menu item
      const checkbox = $(".navbar-container input[type='checkbox']");
      if (checkbox.prop("checked")) {
        checkbox.prop("checked", false);
      }
    }
  });
});
