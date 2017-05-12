<header class="banner" id="responsive-menu">
  
    <a class="brand" href="<?= esc_url(home_url('/')); ?>"><img src="<?php echo get_stylesheet_directory_uri(); ?>/dist/images/logo.svg" alt="<?php bloginfo('name'); ?>"></a>
    <nav class="nav-primary" >
      <?php
      if (has_nav_menu('primary_navigation')) :
        wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav']);
      endif;
      ?>
      <div class="social-wrap">
        <h3>Social</h3>
        <div class="social">
          <a href="https://www.facebook.com/Marco-Gesualdi-Open-Heart-916728638400888/?fref=ts"><span class="fb"></span></a>
          <a href="https://www.youtube.com/channel/UCntbxNJvfSveaP3ykHHJ-6A"><span class="yt"></span></a>
          <a href="mailto:marcogesualdi@libero.it"><span class="mail"></span></a>
        </div>
      </div>
    </nav>
  
</header>
