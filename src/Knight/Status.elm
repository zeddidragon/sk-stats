module Knight.Status exposing (..)

type Status
  = Fire
  | Freeze
  | Shock
  | Poison
  | Stun
  | Curse
  | Sleep
  | Deathmark
  | Random

factor : Float -> Float
factor severity =
  if severity > 3 then
    (8 - severity) * 2
  else
    13 - severity

duration : Status -> Float -> Float
duration status severity =
  let
    base =
      case status of
        Deathmark -> 5
        Stun -> 5
        Poison -> 15
        Sleep -> 15
        Curse -> 60
        _ -> 10
  in
    base * (1 - (factor severity) / 30)

fireDamage : Float -> Int
fireDamage severity =
  ceiling <| 109 * (100 - (factor severity) * 3.2) / 100

fireFrequency : Float
fireFrequency = 2.5

fireTicks : Float -> Int
fireTicks severity =
  ceiling <| 1 + (duration Fire severity - 0.4) / fireFrequency

fireTotal : Float -> Int
fireTotal severity =
  fireDamage severity * fireTicks severity

poisonFactor : Float -> Float
poisonFactor severity =
  50 - 1.5 * factor severity

shockDamage : Float
shockDamage = 78

spasm : Float -> Float
spasm severity =
  1.6 - 0.05 * factor severity

curseDamage : Float -> Int
curseDamage severity =
  ceiling <| 310 * (100 - (factor severity) * 2.5) / 100

curseSlots : Float -> Int
curseSlots severity =
  clamp 1 4 <| floor <| duration Curse severity / 13 - 0.5

curseVials : Float -> Int
curseVials severity =
  min 4 <| ceiling <| (duration Curse severity + 1) / 10 - 2

stunFactor : Float -> Float
stunFactor severity =
  100 - 3 * factor severity

sleepHeal : Float -> Int
sleepHeal severity =
  floor <|  40 - 1.47 * factor severity
