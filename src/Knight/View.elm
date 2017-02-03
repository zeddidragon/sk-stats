module Knight.View exposing (form, stats)

import Html exposing (..)
import Html.Attributes exposing (..)
import Knight.Types exposing (..)
import Knight.UV exposing (..)
import Knight
import Knight.Swords exposing (swords)
import Knight.Armour exposing (armours)
import Knight.Shield exposing (shields)
import View.Shortcuts exposing (selectList, bar, toText)
import Knight.UV.View as UvForm

form message knight =
  let
    equipShield equip = message {knight | shield = equip}
    equipHelmet equip = message {knight | helmet = equip}
    equipArmour equip = message {knight | armour = equip}
    equipWeapon equip = message {knight | weapon = equip}
    equipTrinkets equip = message {knight | trinkets = equip}
  in
    div [ class "knight-form" ]
      ([ h1 [] [ text knight.name ]
      , slot equipShield knight.shield shields "Shield" UvForm.armourForm
      , divisor
      , slot equipHelmet knight.helmet armours "Helmet" UvForm.armourForm
      , slot equipArmour knight.armour armours "Armour" UvForm.armourForm
      , divisor
      , slot equipWeapon knight.weapon swords  "Weapon" UvForm.weaponForm
      , divisor
      ] ++ UvForm.trinketForms equipTrinkets knight.trinkets)

slot message equipment items title uvForm =
  let
    equipPiece piece = message <| {equipment | piece = piece}
    equipUv uvs = message <| {equipment | uvs = uvs}
  in
    div [ class "slot" ]
      ( [ selectList .name equipPiece items equipment.piece |> item title ]
        ++ uvForm equipUv equipment
      )

stats knight =
  List.concat
    [ [ health knight |> item "Health"
      , mobility knight |> item "Mobility"
      ]
    , [ divisor ]
    , defences knight
    , [ divisor ]
    , resistances knight
    , [ divisor ]
    , attacks knight
    ]
  |> div [ class "knight-stats" ]

defences knight =
  let
    maxDefence = 350
    defence (dtype, amount) =
      item (toString dtype) (div [ class "graphic" ]
        [ bar maxDefence (toString dtype) amount
        , div [ class "value" ] [ toText <| round amount ]
        ])
  in
    Knight.defences knight |> List.map defence

pip = div [ class "pip" ] []
pips klass amount =
  let
    n = truncate amount
  in
    div [ class ("graphic " ++ klass) ]
      [ div [ class "graphic negative" ] ( List.repeat -n pip )
      , div [ class "hdivisor"] []
      , div [ class "graphic positive" ] ( List.repeat n pip )
      ]

resistances knight =
  let
    sign amount = if amount > 0 then "+" else ""
    resistance (status, amount) =
      item (toString status) (div [ class "graphic" ]
        [ pips (toString status) amount
        , div [ class "value" ] [ sign amount ++ toString amount |> text ]
        ])
  in
    Knight.resistances knight |> List.map resistance
 
attacks knight =
  let
    piece = knight.weapon.piece
    maxDamage = 715
    bar dType = View.Shortcuts.bar maxDamage (toString dType)
    singlebar damage infliction =
      div [ class "splitbar"]
        ([ bar piece.damageType damage ] ++ status infliction)
    splitbar damage infliction =
      div [ class "splitbar" ] (
        [ bar piece.damageType <| damage / 2
        , bar Normal <| damage / 2
        ] ++ status infliction
      )
    actualStatus =
      case piece.status of
        Just status -> status
        Nothing -> Fire
    value label =
      div [ class "value" ] [ text label ]
    status infliction =
      case infliction of
        Just (chance, strength) ->
          [
            div [ class "status-blurb" ]
              [ span [ class "chance" ] [ (toString chance) ++ "%" |> text]
              , span [] [ text "chance of" ]
              , span [ class "strength" ] [ "+" ++ (toString strength) |> text ]
              , span [ class ("status " ++ (toString actualStatus)) ]
                [ toString actualStatus |> text ]
              ]
          ]
        Nothing -> []
    attack ((stage, damage), infliction) =
      item (toString stage) (div [ class "graphic" ]
        ( if piece.split then
            [ splitbar damage infliction
            , div [class "value"]
              [ value <| (toString (round (damage / 2))) ++ " +"
              , value <| toString <| round (damage / 2)
              ]
            ]
          else
            [ singlebar damage infliction
            , value <| toString <| round damage
            ]
        )
      )
  in
    [ h3 [] [ text piece.name ]
    , attackSpeed knight knight.weapon |> item "Speed"
    , chargeSpeed knight knight.weapon |> item "CT"
    ] ++ (Knight.attacks knight |> List.map attack)

health knight =
  let
    hearts = Knight.hearts knight
    golds =
      if hearts > 60 then hearts - 60
      else 0
    silvers =
      if golds > 0 then 30 - golds
      else if hearts > 30 then hearts - 30
      else 0
    reds =
      if golds > 0 then 0
      else if silvers > 0 then 30 - silvers
      else hearts
  in
    div [ class "row" ]
      [ div [ class "hearts gold" ] [ String.repeat golds "♥" |> text ]
      , div [ class "hearts silver" ] [ String.repeat silvers "♥" |> text ]
      , div [ class "hearts" ] [ String.repeat reds "♥" |> text ]
      , div [ class "value" ] [ Knight.health knight |> toText ]
      ]

mobility knight =
  let
    maxMobility = 130
    speed = Knight.mobility knight
  in
    div [ class "row graphic" ]
      [ pips "speed" ((toFloat speed - 100) / 4)
      , div [ class "value" ] [ (toString speed) ++ "%" |> text ]
      ]

attackSpeed knight weapon =
  let
    speed = Knight.attackSpeed knight weapon
  in
    div [ class "row graphic" ]
      [ pips "speed" ((toFloat speed - 100) / 4)
      , div [ class "value" ] [ (toString speed) ++ "%" |> text ]
      ]

chargeSpeed knight weapon =
  let
    minTime = 1.2
    maxTime = 8
    speed = Knight.chargeSpeed knight weapon
    pretty num =
      let
        full = num * 100 |> floor |> toString
      in
        String.dropRight 2 full ++ "." ++ String.right 2 full
  in
    div [ class "row graphic" ]
      [ bar (maxTime - minTime) "" (maxTime - speed)
      , div [ class "value" ] [ (pretty speed) ++ "s" |> text ]
      ]

item label content =
  div [ class "item" ]
    [ Html.label [] [ text label ]
    , content
    ]

divisor =
  div [ class "divisor" ] []
