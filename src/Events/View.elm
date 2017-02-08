module Events.View exposing (log)

import Events exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Knight exposing (..)
import Knight.UV exposing (..)
import Knight.Types exposing (..)
import View.Shortcuts exposing (toText)
import Util exposing (find)

unknownWeapon : Weapon
unknownWeapon =
  { name = "Unknown Weapon"
  , weaponType = Sword
  , damageType = Normal
  , chargeTime = 0
  , split = Nothing
  , status = Nothing
  , attacks = []
  , inflictions = []
  , bonuses = []
  }

unknownAttack : (Stage, Float)
unknownAttack = (Basic, 0)

unknownEquip : WeaponEquip
unknownEquip =
  { piece = unknownWeapon
  , uvs = []
  }

log message events left right =
  let
    getKnight side = if side == Left then left else right
    getOpponent side = if side == Left then right else left
    getWeapon name =
      weapons
        |> find (\w -> w.name == name)
        |> Maybe.withDefault unknownWeapon
    eventLog events output =
      case events of
        [] -> output
        x::xs -> eventLog xs output ++ eventEntry xs x
    eventEntry history (side, event) =
      case event of
        Attack (weaponName, stage)->
          let
            knight = getKnight side
            damage = Events.damage True side left right history (side, event)
          in
            [ div [ class <| "event " ++ (toString side) ]
              [ div [ class "attack-flow header" ]
                [ div [ class "knight-name" ] [ text <| .name <| knight ]
                , div [ class "weapon" ] [ text weaponName ]
                ]
              , div [ class "attack-flow" ]
                [ div [ class "attack-stage" ] [ toText stage ]
                , div [ class "attack-damage" ] [ toText <| ceiling <| damage ]
                ]
              ]
            ]
        _ -> []
  in
    div [ class "events" ] <| eventLog events []
