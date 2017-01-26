module Knight.View exposing (form, stats)

import Html exposing (..)
import Html.Attributes exposing (..)
import BaseTypes exposing (..)
import Knight
import Swords exposing (swords)
import Armour exposing (armours)
import View.Shortcuts exposing (selectList, bar)
import List
import Msg exposing (..)

form knight =
  div []
    [ item knight.name (div[][])
    , item "Helmet" (selectList EquipHelmet armours knight.helmet.armour)
    , item "Armour" (selectList EquipArmour armours knight.armour.armour)
    , item "Weapon" (selectList EquipWeapon  swords knight.weapon.weapon)
    ]

stats knight =
  div [] (
    [ item "Health" (health knight) ]
    ++ (defences knight)
    ++ (resistances knight)
  )

defences knight =
  let
    defence (dtype, amount) =
      item (toString dtype) (div [ class "graphic" ]
        [ bar (toString dtype) amount Knight.maxDefence
        , div [ class "value" ] [ text (toString amount) ]
        ])
  in
    List.map defence (Knight.defences knight)

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
        , div [ class "value" ] [ text (toString amount) ]
        ])
  in
    List.map resistance (Knight.resistances knight)

health knight =
  div [ class "row" ]
    [ div [ class "hearts" ] [ text (String.repeat (Knight.hearts knight) "♥") ]
    , div [ class "value" ] [ text (toString (Knight.health knight)) ]
    ]


item label content =
  div [ class "item" ]
    [ Html.label [] [text label]
    , content
    ]

