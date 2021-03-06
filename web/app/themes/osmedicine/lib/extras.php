<?php

namespace Roots\Sage\Extras;

use Roots\Sage\Setup;
use WP_Widget;

/**
 * Add <body> classes
 */
function body_class($classes) {
  // Add page slug if it doesn't exist
  if (is_single() || is_page() && !is_front_page()) {
    if (!in_array(basename(get_permalink()), $classes)) {
      $classes[] = basename(get_permalink());
    }
  }

  // Add class if sidebar is active
  if (Setup\display_sidebar()) {
    $classes[] = 'sidebar-primary';
  }

  return $classes;
}
add_filter('body_class', __NAMESPACE__ . '\\body_class');

/**
 * Clean up the_excerpt()
 */
function excerpt_more() {
  return ' &hellip; <a href="' . get_permalink() . '">' . __('Continued', 'sage') . '</a>';
}
add_filter('excerpt_more', __NAMESPACE__ . '\\excerpt_more');







//add_filter('wp_nav_menu_items',__NAMESPACE__ . '\\add_search_box_to_menu', 10, 2);
function add_search_box_to_menu( $items, $args ) {
    if( $args->theme_location == 'primary_navigation' )
        $items=$items.'<li class="menu-item search" >'.get_search_form(false).'</li>';
      return $items;

    
}

// Numbered Pagination
if ( !function_exists( 'wpex_pagination' ) ) {
  
  function wpex_pagination() {
    
    $prev_arrow = is_rtl() ? '&rarr;' : '&larr;';
    $next_arrow = is_rtl() ? '&larr;' : '&rarr;';
    
    global $wp_query;
    $total = $wp_query->max_num_pages;
    $big = 999999999; // need an unlikely integer
    if( $total > 1 )  {
       if( !$current_page = get_query_var('paged') )
         $current_page = 1;
       if( get_option('permalink_structure') ) {
         $format = 'page/%#%/';
       } else {
         $format = '&paged=%#%';
       }
      echo paginate_links(array(
        'base'      => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
        'format'    => $format,
        'current'   => max( 1, get_query_var('paged') ),
        'total'     => $total,
        'mid_size'    => 2,
        'type'      => 'list',
        'prev_text'   => $prev_arrow,
        'next_text'   => $next_arrow,
       ) );
    }
  }
  
}
//add_action( 'after_setup_theme', __NAMESPACE__ . '\\tgm_envira_define_license_key' );
function tgm_envira_define_license_key() {
    
    // If the key has not already been defined, define it now.
    if ( ! defined( 'ENVIRA_LICENSE_KEY' ) ) {
        define( 'ENVIRA_LICENSE_KEY', 'f21b503f7793be583daab680a7f8bda7' );
    }
    
}

add_action( 'wp_ajax_gesualdi_disco', __NAMESPACE__ . '\\gesualdi_disco' );
add_action( 'wp_ajax_nopriv_gesualdi_disco', __NAMESPACE__ . '\\gesualdi_disco' );
function gesualdi_disco() {
    if ( ! wp_verify_nonce( $_POST['nonce'], 'gesualdi-nonce' ) ) die ( 'Non autorizzato!');
    ob_clean();
    $post_link=isset( $_POST['postlink'] ) ? sanitize_text_field($_POST['postlink'] ):'';
    if($post_link !== ''){$post_id=url_to_postid($post_link);}else{
      $data=  __( '<p class="error"><strong>ERROR</strong>: No link. </p>', 'sage' );
    wp_send_json_error($data);
    wp_die();
    }
    if($post_id !==0){
      $disco=get_post($post_id );
      setup_postdata($GLOBALS['post'] =& $disco );
      //$title=mb_convert_encoding(get_the_title(), 'UTF-8', 'HTML-ENTITIES');
      $title=html_entity_decode( get_the_title( ), ENT_QUOTES, 'UTF-8' ) ;
      $thumbnail=get_the_post_thumbnail($disco->ID,'thumbnail');
      $tracklist=get_field('tracklist',$disco->ID);
      $excerpt=get_the_excerpt( );
      $audio_sample=get_field('audio_sample',$disco->ID);
      wp_reset_postdata();
      $data= array('title'=>$title,'thumb'=>$thumbnail,'tracklist'=>$tracklist,'excerpt'=>wpautop($excerpt,true),'audio_sample'=>$audio_sample);
        wp_send_json_success( $data );
    }else{
      $data=  __( '<p class="error"><strong>ERROR</strong>: No post with id: </p>', 'sage' ).$post_id ;
    wp_send_json_error($data);
    }
    wp_die();
}
?>