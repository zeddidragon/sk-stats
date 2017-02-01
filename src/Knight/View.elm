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
      ( [ selectList equipPiece items equipment.piece |> item title ]
        ++ uvForm equipUv equipment
      )

stats knight =
  List.concat
    [ [ item "Health" (health knight) ]
    , [ divisor ]
    , defences knight
    , [ divisor ]
    , resistances knight
    , [ divisor ]
    ]
  |> div [ class "knight-stats" ]

defences knight =
  let
    defence (dtype, amount) =
      item (toString dtype) (div [ class "graphic" ]
        [ bar (toString dtype) amount Knight.maxDefence
        , div [ class "value" ] [ toText amount ]
        ])
  in
    Knight.defences knight |> List.map defence

resistances knight =
  let
    pip = div [ class "pip" ] []
    pips status amount =
      let
        n = truncate amount
      in
        div [ class ("graphic " ++ (toString status)) ]
          [ div [ class "graphic negative" ] ( List.repeat -n pip )
          , div [ class "graphic positive" ] ( List.repeat n pip )
          ]
    resistance (status, amount) =
      item (toString status) (div [ class "graphic" ]
        [ pips status amount
        , div [ class "value" ] [ toText amount ]
        ])
  in
    List.map resistance (Knight.resistances knight)

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

item label content =
  div [ class "item" ]
    [ Html.label [] [ text label ]
    , content
    ]

divisor =
  div [ class "divisor" ] []
