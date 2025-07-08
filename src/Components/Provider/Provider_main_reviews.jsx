import React from 'react'
import Provider_header from './Provider_header'
import Provider_sidemenu from './Provider_sidemenu'
import Provider_footer from './Provider_footer'
import Provider_reviews from './Provider_reviews'
import Provider_review_stats from './Provider_review_stats'

const Provider_main_reviews = () => {
  return (
    <div className="Eventmanager_app">
            <Provider_header/>
            <div className="EMSlidemenuandPagecontent">
                <Provider_sidemenu/>
                <Provider_reviews/>
                <Provider_review_stats/>
            </div>
            <Provider_footer/>
        </div>
  )
}

export default Provider_main_reviews
