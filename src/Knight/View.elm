module Knight.View exposing (form, stats)

import Html exposing (..)
import Html.Attributes exposing (..)
import BaseTypes exposing (..)
import Knight
import Swords exposing (swords)
import Armour exposing (armours)
import View.Shortcuts exposing (selectList, bar, toText)
import Knight.UvForm exposing (weaponUvForm, armourUvForm)

form message knight =
  let
    equipHelmet equip = message {knight | helmet = equip}
    equipArmour equip = message {knight | armour = equip}
    equipWeapon equip = message {knight | weapon = equip}
    equipTrinkets equip = message {knight | trinkets = equip}
  in
    div []
      [ h1 [] [ text knight.name ]
      , slot equipHelmet knight.helmet armours "Helmet" armourUvForm
      , slot equipArmour knight.armour armours "Armour" armourUvForm
      , slot equipWeapon knight.weapon swords  "Weapon" weaponUvForm
      ] ++ trinketForm

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
    , defences knight
    , resistances knight
    ]
  |> div []

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
  div [ class "row" ]
    [ div [ class "hearts" ] [ String.repeat (Knight.hearts knight) "♥" |> text ]
    , div [ class "value" ] [ Knight.health knight |> toText ]
    ]


item label content =
  div [ class "item" ]
    [ Html.label [] [ text label ]
    , content
    ]

