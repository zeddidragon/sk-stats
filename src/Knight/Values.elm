module Knight.Values exposing (..)

charge =
  { quick = 1
  , normal = 2
  , long = 3
  , painful = 6
  , irontech = 2.5
  }

attacks =
-- Swords --
  { sword = 415 / 1.24
  , swordFinish = 477 / 1.24
  , swordCharge = 623 / 1.24
  , swordChargeFinish = 668 / 1.24
  , swordSpecial = 266 / 1.24

  , civ = 315
  , civHeavy = 353

  , swordLight = 358 / 1.24
  , swordLightFinish = 411 / 1.24
  , swordLightCharge = 537 / 1.24
  , swordLightChargeFinish = 587 / 1.24

  , swordHeavy = 477 / 1.24
  , swordHeavyFinish = 548 / 1.24
  , swordHeavyCharge = 668 / 1.24
  , swordHeavyChargeFinish = 715 / 1.24

  , brandish = 609 / 1.24
  , brandishFinish = 711 / 1.24
  , brandishCharge = 959 / 1.24
  , brandishSpecial = 447 / 1.24

  , brandishHeavy = 656 / 1.24
  , brandishHeavyFinish = 774 / 1.24
  , brandishHeavyCharge = 1040 / 1.24
  , brandishHeavySpecial = 480 / 1.24

  , fang = 566 / 1.24
  , fangFinish = 666 / 1.24
  , fangCharge = 897 / 1.24

-- Guns --
  , blaster = 314 / 1.24
  , blasterCharge = 532 / 1.24

  , nova = 336 / 1.24
  , novaCharge = 572 / 1.24

  , driver = 295 / 1.24
  , driverCharge = 501 / 1.24

  , antigua = 231 / 1.24
  , antiguaCharge = 392 / 1.24

  , pepper = (231 / 1.24) * 0.88
  , pepperCharge = (391 / 1.24) * 0.88

  , magnus = 360 / 1.24
  , magnusCharge = 611 / 1.24
  , neutralizer = 652 / 1.24
  
  , tortofist = 252 / 1.24

-- Bombs --
  , nitro = 443 / 1.24
  , irontech = 476 / 1.24
  , bab = 509 / 1.24

  , haze = 389 / 1.24
  , graviton = 24 / 1.24
  , gravitonCollapse = 423 / 1.24

  , dr = 182 / 1.24 

  , shardCore = 246 / 1.24
  , shardPure = 296 / 1.24
  , shardStatus = 271 / 1.24

  , shardOld = 593 / 1.24
  }
