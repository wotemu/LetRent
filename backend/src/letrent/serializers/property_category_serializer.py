from ..utils import glue_slugs


def recursive_category_node_to_dict(node, parent_full_slug=None):
    full_slug = glue_slugs(parent_full_slug, node.slug)
    result = {
        'id': node.pk,
        'name': node.name,
        'level': node.level,
        'fullSlug': full_slug
        # 'slug': node.slug,
        # 'parent': node.parent
    }
    children = [recursive_category_node_to_dict(c, full_slug) for c in node.get_children()]
    if children:
        result['children'] = children
    return result


def build_nested_category_tree(category_nodes):
    category_tree = []
    for n in category_nodes:
        category_tree.append(recursive_category_node_to_dict(n))
    return category_tree
