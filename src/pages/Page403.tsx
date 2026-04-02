import React from "react";
import "./Page403.css"; // fichier CSS séparé
import lotusViolet from "../assets/images/lotus-violet.png"; // chemin vers l'image du lotus violet

const Page403 = () => {
  return (
    <div className="page-403">
      <div className="zen-block">
            <img
              src={lotusViolet} // remplace par ton image
              alt="Lotus Zen"
              className="zen-image"
            />
        <div className="zen-text">
          <h1>403 - Accès non autorisé</h1>
            <p>Quand une voie se ferme, une autre s'ouvre ... Restez zen comme un lotus.</p>
        </div>
      </div>
    </div>
  );
};

export default Page403;