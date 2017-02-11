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
        Curse -> 60
        _ -> 10
  in
    base * (1 - (factor severity) / 30)

poisonModifier : Float -> Float
poisonModifier severity =
  50 - 1.5 * factor severity

shockDamage: Float
shockDamage = 78

spasm : Float -> Float
spasm severity =
  1.6 - 0.05 * factor severity
