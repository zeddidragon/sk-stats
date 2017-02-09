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
  , swordSpecial = 268 / 1.24

  , civ = 315
  , civHeavy = 353

  , swordLight = 361 / 1.24
  , swordLightFinish = 415 / 1.24
  , swordLightCharge = 541 / 1.24
  , swordLightChargeFinish = 591 / 1.24

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
  , brandishHeavySpecial = 484 / 1.24

  , fang = 570 / 1.24
  , fangFinish = 671 / 1.24
  , fangCharge = 904 / 1.24

-- Guns --
  , blaster = 314 / 1.25
  , blasterCharge = 535 / 1.24

  , nova = 339 / 1.24
  , novaCharge = 576 / 1.24

  , driver = 297 / 1.24
  , driverCharge = 504 / 1.24

  , antigua = 231 / 1.24
  , antiguaCharge = 392 / 1.24

  , pepper = (231 / 1.24) * 0.88
  , pepperCharge = (391 / 1.24) * 0.88

  , magnus = 362 / 1.24
  , magnusCharge = 616 / 1.24

  , neutralizer = 657 / 1.24
  
  , tortofist = 252 / 1.24

-- Bombs --
  , nitro = 446 / 1.24
  , irontech = 479 / 1.24
  , bab = 512 / 1.24

  , haze = 392 / 1.24
  , graviton = 24 / 1.24
  , gravitonCollapse = 425 / 1.24

  , dr = 183 / 1.24

  , shardCore = 249 / 1.24
  , shardPure = 298 / 1.24
  , shardStatus = 273 / 1.24

  , shardOld = 593 / 1.24
  , saltOld = 305
  }
